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
  
  // KPIs
  studentCount: number = 0;
  teacherCount: number = 0;
  todayMeetings: number = 0;

  // Listas
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';

  // Variables para el Formulario (Crear/Editar)
  showForm: boolean = false; // ¿Se ve el formulario?
  isEditing: boolean = false; // ¿Estamos editando o creando?
  userForm: User = this.getEmptyUser(); // Datos del formulario

  constructor(
    private usersService: UsersService,
    private meetingsService: MeetingsService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.users = this.usersService.getUsers();
    this.filterUsers(); // Aplicar filtro si lo hubiera
    
    // Recalcular contadores
    this.studentCount = this.users.filter(u => u.role === 'student').length;
    this.teacherCount = this.users.filter(u => u.role === 'teacher').length;
    this.todayMeetings = this.meetingsService.getTodayMeetingsCount();
  }

  // --- LÓGICA DEL FORMULARIO ---

  // Botón "Crear Nuevo"
  openCreateForm() {
    this.isEditing = false;
    this.userForm = this.getEmptyUser(); // Limpiar formulario
    this.showForm = true;
  }

  // Botón "Editar" (en la tabla)
  openEditForm(user: User) {
    this.isEditing = true;
    // Copiamos el usuario para no modificar la tabla directamente mientras escribimos (Clonación)
    this.userForm = { ...user }; 
    this.showForm = true;
  }

  // Botón "Guardar" del formulario
  onSubmit() {
    if (this.isEditing) {
      this.usersService.updateUser(this.userForm);
    } else {
      this.usersService.createUser(this.userForm);
    }
    
    // Cerrar y recargar
    this.showForm = false;
    this.loadData();
  }

  // Botón "Cancelar"
  cancelForm() {
    this.showForm = false;
  }

  // Auxiliar: Usuario vacío
  getEmptyUser(): User {
    return {
      id: 0,
      username: '',
      password: '123', // Password por defecto
      nombre: '',
      apellidos: '',
      email: '',
      role: 'student' // Rol por defecto
    };
  }

  // --- LÓGICA EXISTENTE ---

  onDeleteUser(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
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