import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CentrosService, Centro } from '../../services/centros';

declare var L: any;

@Component({
  selector: 'app-centro-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './centro-selector.html',
  styleUrl: './centro-selector.css'
})
export class CentroSelector implements OnInit, AfterViewInit, OnDestroy {
  @Input() selectedCentroId: string = '15112';
  @Output() centroSelected = new EventEmitter<Centro>();

  centros: Centro[] = [];
  filteredCentros: Centro[] = [];
  selectedCentro: Centro | null = null;
  isLoading = true;

  tipos: string[] = [];
  territorios: string[] = [];
  municipios: string[] = [];

  filterTipo: string = '';
  filterTerritorio: string = '';
  filterMunicipio: string = '';

  private map: any;
  private markerGroup: any;
  private mapInitialized = false;

  constructor(
    private centrosService: CentrosService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadCentros();
    this.loadFilterOptions();
  }

  ngAfterViewInit() {
  }

  private tryInitMap(attempts = 0) {
    if (this.mapInitialized) return;
    
    if (attempts > 10) return;
    
    const container = document.getElementById('map-container');
    
    if (container && container.clientWidth > 0) {
      this.initMap();
    } else {
      setTimeout(() => this.tryInitMap(attempts + 1), 200);
    }
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  loadCentros() {
    this.isLoading = true;
    this.centrosService.getCentros().subscribe({
      next: (centros) => {
        this.centros = centros;
        this.filteredCentros = centros;
        this.isLoading = false;
        
        if (this.selectedCentroId) {
          this.selectedCentro = centros.find(c => c.CCODIGO === this.selectedCentroId) || null;
        }
        
        this.cdr.detectChanges();
        
        setTimeout(() => {
          this.tryInitMap();
        }, 100);
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadFilterOptions() {
    this.centrosService.getTipos().subscribe(tipos => {
      this.tipos = tipos;
      this.cdr.detectChanges();
    });
    
    this.centrosService.getTerritorios().subscribe(territorios => {
      this.territorios = territorios;
      this.cdr.detectChanges();
    });
  }

  onTerritorioChange() {
    this.filterMunicipio = '';
    this.centrosService.getMunicipios(this.filterTerritorio).subscribe(municipios => {
      this.municipios = municipios;
      this.cdr.detectChanges();
    });
    this.applyFilters();
  }

  applyFilters() {
    this.centrosService.filterCentros({
      tipo: this.filterTipo,
      territorio: this.filterTerritorio,
      municipio: this.filterMunicipio
    }).subscribe(centros => {
      this.filteredCentros = centros;
      this.cdr.detectChanges();
      this.updateMarkers();
    });
  }

  clearFilters() {
    this.filterTipo = '';
    this.filterTerritorio = '';
    this.filterMunicipio = '';
    this.municipios = [];
    this.filteredCentros = this.centros;
    this.cdr.detectChanges();
    this.updateMarkers();
  }

  selectCentro(centro: Centro) {
    this.selectedCentro = centro;
    this.selectedCentroId = centro.CCODIGO;
    this.centroSelected.emit(centro);
    
    if (this.map && this.mapInitialized) {
      this.map.setView([centro.LAT, centro.LON], 14);
    }
    
    this.updateMarkers();
  }

  private initMap() {
    const container = document.getElementById('map-container');
    
    if (!container) return;

    if (typeof L === 'undefined') return;

    try {
      this.map = L.map('map-container').setView([43.263, -2.935], 10);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19
      }).addTo(this.map);

      this.markerGroup = L.layerGroup().addTo(this.map);

      this.mapInitialized = true;
      
      this.updateMarkers();
      
      setTimeout(() => {
        if (this.map) {
          this.map.invalidateSize();
        }
      }, 100);

    } catch (error) {
    }
  }

  private updateMarkers() {
    if (!this.map || !this.mapInitialized || !this.markerGroup) return;

    this.markerGroup.clearLayers();

    this.filteredCentros.forEach(centro => {
      const isSelected = centro.CCODIGO === this.selectedCentroId;
      
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          width: 24px;
          height: 24px;
          background-color: ${isSelected ? '#dc3545' : '#007bff'};
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
      });

      const marker = L.marker([centro.LAT, centro.LON], { icon })
        .bindPopup(`
          <strong>${centro.DNOMBRE}</strong><br>
          <small>${centro.DDOMICILIO || ''}</small><br>
          <small>${centro.DMUNI}, ${centro.DTERRE}</small>
        `)
        .on('click', () => {
          this.selectCentro(centro);
        });

      this.markerGroup.addLayer(marker);
    });

    if (this.filteredCentros.length > 0) {
      const bounds = L.latLngBounds(
        this.filteredCentros.map((c: Centro) => [c.LAT, c.LON])
      );
      this.map.fitBounds(bounds, { padding: [30, 30] });
    }
  }
}
