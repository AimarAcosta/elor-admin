import { Routes } from '@angular/router';
import { authGuard } from './services/auth.guard'; 

import { Login } from './pages/login/login';
import { HomeGod } from './pages/home-god/home-god';
import { HomeAdmin } from './pages/home-admin/home-admin';
import { HomeTeacher } from './pages/home-teacher/home-teacher';
import { HomeStudent } from './pages/home-student/home-student';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  { 
    path: 'login', 
    component: Login
  },

  { 
    path: 'god', 
    component: HomeGod,
    canActivate: [authGuard],
    data: { role: 'god' } 
  },

  { 
    path: 'admin', 
    component: HomeAdmin,
    canActivate: [authGuard],
    data: { role: 'admin' }
  },

  { 
    path: 'teacher', 
    component: HomeTeacher,
    canActivate: [authGuard],
    data: { role: 'teacher' }
  },

  { 
    path: 'student', 
    component: HomeStudent,
    canActivate: [authGuard],
    data: { role: 'student' }
  },

  { path: '**', redirectTo: 'login' }
];