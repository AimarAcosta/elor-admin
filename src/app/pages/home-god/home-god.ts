import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { UsersService, User } from '../../services/users';
import { MeetingsService } from '../../services/meetings';

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
  searchTerm: string = '';

  showForm: boolean = false; 
  isEditing: boolean = false; 
  userForm: User = this.getEmptyUser(); 

  constructor(
    private usersService: UsersService,
    private meetingsService: MeetingsService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.users = this.usersService.getUsers();
    this.filterUsers(); 
    
    this.studentCount = this.users.filter(u => u.role === 'student').length;
    this.teacherCount = this.users.filter(u => u.role === 'teacher').length;
    this.todayMeetings = this.meetingsService.getTodayMeetingsCount();
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
    if (this.isEditing) {
      this.usersService.updateUser(this.userForm);
    } else {
      this.usersService.createUser(this.userForm);
    }
    
    this.showForm = false;
    this.loadData();
  }

  cancelForm() {
    this.showForm = false;
  }

  getEmptyUser(): User {
    return {
      id: 0,
      username: '',
      password: '123', 
      nombre: '',
      apellidos: '',
      email: '',
      role: 'student' 
    };
  }

  onDeleteUser(id: number) {
    if (confirm('¿Erabiltzaile hau ezabatu nahi duzu?')) {
      const success = this.usersService.deleteUser(id);
      if (success) {
        this.loadData();
      } else {
        alert('ERROREA: Ezin duzu administratzaile bat ezabatu.');
      }
    }
  }

  filterUsers() {
    this.filteredUsers = this.users.filter(user => 
      user.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.apellidos.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}