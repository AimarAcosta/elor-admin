import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userKey = 'currentUser';

  constructor(private router: Router) {}

  login(user: any) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  logout() {
    localStorage.removeItem(this.userKey);
    this.router.navigate(['/login']);
  }

  getUser() {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.userKey);
  }

  hasRole(expectedRole: string): boolean {
    const user = this.getUser();
    if (!user) return false;
    
    if (user.tipo_id === 1) return true;
    
    const roleMap: { [key: string]: number } = {
      'god': 1,
      'admin': 2,
      'teacher': 3,
      'student': 4
    };
    
    return user.tipo_id === roleMap[expectedRole];
  }
}