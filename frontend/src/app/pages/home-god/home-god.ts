import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { UsersService, User, Tipo } from '../../services/users';
import { ReunionesService } from '../../services/meetings';

@Component({
  selector: 'app-home-god',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './home-god.html',
  styleUrls: ['./home-god.css']
})
export class HomeGod implements OnInit {
  
  studentCount: number = 0;
  teacherCount: number = 0;
  todayMeetings: number = 0;

  users: User[] = [];
  filteredUsers: User[] = [];
  tipos: Tipo[] = [];
  searchTerm: string = '';

  showForm: boolean = false; 
  isEditing: boolean = false; 
  userForm: Partial<User> = this.getEmptyUser(); 

  constructor(
    private usersService: UsersService,
    private reunionesService: ReunionesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadData();
    this.loadTipos();
  }

  loadData() {
    this.usersService.getUsers().subscribe(users => {
      this.users = users;
      this.filterUsers(); 
      this.studentCount = this.users.filter(u => u.tipo_id === 4).length;
      this.teacherCount = this.users.filter(u => u.tipo_id === 3).length;
      this.cdr.detectChanges();
    });
    
    this.reunionesService.getTodayCount().subscribe(count => {
      this.todayMeetings = count;
      this.cdr.detectChanges();
    });
  }

  loadTipos() {
    this.usersService.getTipos().subscribe(tipos => {
      this.tipos = tipos;
      this.cdr.detectChanges();
    });
  }

  openCreateForm() {
    this.isEditing = false;
    this.userForm = this.getEmptyUser(); 
    this.showForm = true;
  }

  openEditForm(user: User) {
    this.isEditing = true;
    this.userForm = { ...user }; 
    this.showForm = true;
  }

  onSubmit() {
    if (this.isEditing && this.userForm.id) {
      this.usersService.updateUser(this.userForm.id, this.userForm).subscribe(() => {
        this.showForm = false;
        this.loadData();
      });
    } else {
      this.usersService.createUser(this.userForm).subscribe(() => {
        this.showForm = false;
        this.loadData();
      });
    }
  }

  cancelForm() {
    this.showForm = false;
  }

  getEmptyUser(): Partial<User> {
    return {
      username: '',
      password: '123456', 
      nombre: '',
      apellidos: '',
      email: '',
      tipo_id: 4 // Por defecto alumno
    };
  }

  onDeleteUser(id: number) {
    const user = this.users.find(u => u.id === id);
    if (user && user.tipo_id === 1) {
      alert('ERROREA: Ezin duzu God erabiltzailea ezabatu.');
      return;
    }
    
    if (confirm('¿Erabiltzaile hau ezabatu nahi duzu?')) {
      this.usersService.deleteUser(id).subscribe(success => {
        if (success) {
          this.loadData();
        } else {
          alert('ERROREA: Ezin izan da erabiltzailea ezabatu.');
        }
      });
    }
  }

  filterUsers() {
    this.filteredUsers = this.users.filter(user => 
      (user.nombre?.toLowerCase() || '').includes(this.searchTerm.toLowerCase()) ||
      (user.apellidos?.toLowerCase() || '').includes(this.searchTerm.toLowerCase()) ||
      (user.username?.toLowerCase() || '').includes(this.searchTerm.toLowerCase())
    );
  }

  getRoleName(tipoId: number): string {
    return this.usersService.getRoleName(tipoId);
  }
}