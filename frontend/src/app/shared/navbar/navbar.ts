import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { AuthService } from '../../services/auth';
import { TranslationService, Language } from '../../services/translation';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule, TranslatePipe],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit, OnDestroy {
  
  currentLang: Language = 'eu';
  languages = [
    { code: 'eu' as Language, name: 'Euskara', flag: '🇪🇺' },
    { code: 'es' as Language, name: 'Español', flag: '🇪🇸' },
    { code: 'en' as Language, name: 'English', flag: '🇬🇧' }
  ];
  
  private langSubscription?: Subscription;
  
  get currentUser() {
    return this.authService.getUser();
  }

  constructor(
    private authService: AuthService, 
    private router: Router,
    private translationService: TranslationService
  ) {}

  ngOnInit() {
    this.currentLang = this.translationService.lang;
    this.langSubscription = this.translationService.currentLang$.subscribe(lang => {
      this.currentLang = lang;
    });
  }

  ngOnDestroy() {
    this.langSubscription?.unsubscribe();
  }

  changeLanguage(lang: Language) {
    this.translationService.setLanguage(lang);
  }

  logout() {
    this.authService.logout(); 
    this.router.navigate(['/login']); 
  }
}