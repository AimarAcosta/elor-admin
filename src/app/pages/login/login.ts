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

        switch (user.tipo_id) {
          case 1: // god
            this.router.navigate(['/god']);
            break;
          case 2: // admin
            this.router.navigate(['/admin']);
            break;
          case 3: // teacher/profesor
            this.router.navigate(['/teacher']);
            break;
          case 4: // student/alumno
            this.router.navigate(['/student']);
            break;
        }
      } else {
        this.errorMessage = 'Erabiltzailea edo pasahitza okerra da.';
      }
    });
  }
}
