import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

export type Language = 'eu' | 'es' | 'en';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private currentLang = new BehaviorSubject<Language>('eu');
  private translations: { [key: string]: any } = {};

  currentLang$ = this.currentLang.asObservable();

  constructor(private http: HttpClient) {
    this.loadTranslationsSync('eu');
  }

  get lang(): Language {
    return this.currentLang.value;
  }

  setLanguage(lang: Language) {
    if (lang === this.currentLang.value) return;
    this.http.get<any>(`/assets/i18n/${lang}.json`).subscribe({
      next: (data) => {
        this.translations = data;
        this.currentLang.next(lang);
      },
      error: () => {},
    });
  }

  private loadTranslationsSync(lang: Language) {
    this.http.get<any>(`/assets/i18n/${lang}.json`).subscribe({
      next: (data) => {
        this.translations = data;
        this.currentLang.next(lang);
      },
      error: () => {},
    });
  }

  translate(key: string): string {
    const keys = key.split('.');
    let result: any = this.translations;

    for (const k of keys) {
      if (result && result[k] !== undefined) {
        result = result[k];
      } else {
        return key;
      }
    }

    return typeof result === 'string' ? result : key;
  }

  instant(key: string): string {
    return this.translate(key);
  }
}
