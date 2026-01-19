import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { UsersService, User, Tipo } from '../../services/users';
import { ReunionesService } from '../../services/meetings';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-home-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './home-admin.html',
  styleUrls: ['./home-admin.css']
})
export class HomeAdmin implements OnInit {
  
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
      this.tipos = tipos.filter(t => t.id !== 1);
      this.cdr.detectChanges();
    });
  }

  onDeleteUser(id: number) {
    const user = this.users.find(u => u.id === id);
    if (user && (user.tipo_id === 1 || user.tipo_id === 2)) {
      alert('ERROREA: Ez duzu baimenik administratzaile edo Jainkoa ezabatzeko.');
      return;
    }
    
    if (confirm('¿Ziur zaude erabiltzaile hau ezabatu nahi duzula? (¿Seguro?)')) {
      this.usersService.deleteUser(id).subscribe(success => {
        if (success) {
          this.loadData();
        } else {
          alert('ERROREA: Ezin izan da erabiltzailea ezabatu.');
        }
      });
    }
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
    if (this.userForm.tipo_id === 1) {
      alert('Ezin duzu Jainkorik sortu.');
      return;
    }

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

  filterUsers() {
    this.filteredUsers = this.users.filter(user => 
      (user.nombre?.toLowerCase() || '').includes(this.searchTerm.toLowerCase()) ||
      (user.apellidos?.toLowerCase() || '').includes(this.searchTerm.toLowerCase()) ||
      (user.username?.toLowerCase() || '').includes(this.searchTerm.toLowerCase())
    );
  }

  getEmptyUser(): Partial<User> {
    return { username: '', password: '123456', nombre: '', apellidos: '', email: '', tipo_id: 4 };
  }

  getRoleName(tipoId: number): string {
    return this.usersService.getRoleName(tipoId);
  }
}