import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { UsersService } from '../../services/users';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  username = '';
  password = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private router: Router
  ) {}

  onLogin() {
    this.usersService.login(this.username, this.password).subscribe((user) => {
      if (user) {
        console.log('Login correcto:', user.username);
        this.authService.login(user);

        switch (user.role) {
          case 'god':
            this.router.navigate(['/god']);
            break;
          case 'admin':
            this.router.navigate(['/admin']);
            break;
          case 'teacher':
            this.router.navigate(['/teacher']);
            break;
          case 'student':
            this.router.navigate(['/student']);
            break;
        }
      } else {
        this.errorMessage = 'Erabiltzailea edo pasahitza okerra da.';
      }
    });
  }
}
