import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';

export interface Centro {
  CCODIGO: string;
  DNOMBRE: string;
  DTITUC: string;
  DTERRE: string;
  DMUNI: string;
  DDOMICILIO: string;
  CPOSTAL: string;
  TELEFONO: string;
  EMAIL: string;
  LAT: number;
  LON: number;
}

@Injectable({
  providedIn: 'root'
})
export class CentrosService {
  private centros: Centro[] = [];
  private dataUrl = '/assets/data/centros.json';

  constructor(private http: HttpClient) {}

  getCentros(): Observable<Centro[]> {
    if (this.centros.length > 0) {
      return of(this.centros);
    }
    return this.http.get<Centro[]>(this.dataUrl).pipe(
      map(data => {
        this.centros = data;
        return data;
      })
    );
  }

  getCentroById(codigo: string): Observable<Centro | undefined> {
    return this.getCentros().pipe(
      map(centros => centros.find(c => c.CCODIGO === codigo))
    );
  }

  filterByTipo(tipo: string): Observable<Centro[]> {
    return this.getCentros().pipe(
      map(centros => tipo ? centros.filter(c => c.DTITUC === tipo) : centros)
    );
  }

  filterByTerritorio(territorio: string): Observable<Centro[]> {
    return this.getCentros().pipe(
      map(centros => territorio ? centros.filter(c => c.DTERRE === territorio) : centros)
    );
  }

  filterByMunicipio(municipio: string): Observable<Centro[]> {
    return this.getCentros().pipe(
      map(centros => municipio ? centros.filter(c => c.DMUNI === municipio) : centros)
    );
  }

  filterCentros(filters: { tipo?: string; territorio?: string; municipio?: string }): Observable<Centro[]> {
    return this.getCentros().pipe(
      map(centros => {
        let result = centros;
        if (filters.tipo) {
          result = result.filter(c => c.DTITUC === filters.tipo);
        }
        if (filters.territorio) {
          result = result.filter(c => c.DTERRE === filters.territorio);
        }
        if (filters.municipio) {
          result = result.filter(c => c.DMUNI === filters.municipio);
        }
        return result;
      })
    );
  }

  getTipos(): Observable<string[]> {
    return this.getCentros().pipe(
      map(centros => [...new Set(centros.map(c => c.DTITUC))])
    );
  }

  getTerritorios(): Observable<string[]> {
    return this.getCentros().pipe(
      map(centros => [...new Set(centros.map(c => c.DTERRE))])
    );
  }

  getMunicipios(territorio?: string): Observable<string[]> {
    return this.getCentros().pipe(
      map(centros => {
        const filtered = territorio 
          ? centros.filter(c => c.DTERRE === territorio)
          : centros;
        return [...new Set(filtered.map(c => c.DMUNI))].sort();
      })
    );
  }

  getDefaultCentro(): Observable<Centro | undefined> {
    return this.getCentroById('15112');
  }
}
