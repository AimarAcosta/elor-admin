import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
  
  get currentUser() {
    return this.authService.getUser();
  }

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  logout() {
    this.authService.logout(); 
    this.router.navigate(['/login']); 
  }
}