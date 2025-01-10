// src/app/components/auth/login/login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="login-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Iniciar Sesión</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          @if (errorMessage) {
            <div class="error-message">
              {{ errorMessage }}
            </div>
          }

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field class="full-width">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email">
              @if (loginForm.get('email')?.hasError('required') && loginForm.get('email')?.touched) {
                <mat-error>El email es requerido</mat-error>
              }
              @if (loginForm.get('email')?.hasError('email')) {
                <mat-error>Ingresa un email válido</mat-error>
              }
            </mat-form-field>

            <mat-form-field class="full-width">
              <mat-label>Contraseña</mat-label>
              <input matInput formControlName="password" type="password">
              @if (loginForm.get('password')?.hasError('required') && loginForm.get('password')?.touched) {
                <mat-error>La contraseña es requerida</mat-error>
              }
            </mat-form-field>

            <button 
              mat-raised-button 
              color="primary" 
              type="submit"
              [disabled]="loginForm.invalid || isLoading"
              class="full-width"
            >
              @if (isLoading) {
                <mat-spinner diameter="20" class="spinner"></mat-spinner>
                Iniciando sesión...
              } @else {
                Iniciar Sesión
              }
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      max-width: 400px;
      margin: 40px auto;
      padding: 0 20px;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .full-width {
      width: 100%;
    }
    .error-message {
      background-color: #ffebee;
      color: #c62828;
      padding: 12px;
      border-radius: 4px;
      margin-bottom: 16px;
      text-align: center;
    }
    .spinner {
      display: inline-block;
      margin-right: 8px;
    }
    button {
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.router.navigate(['/videos']);
        },
        error: (error) => {
          this.isLoading = false;
          
          if (error.status === 404) {
            this.errorMessage = 'Usuario no encontrado';
          } else if (error.status === 401) {
            this.errorMessage = 'Contraseña incorrecta';
          } else if (error.error?.message) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = 'Error al iniciar sesión';
          }
        }
      });
    } else {
      this.errorMessage = 'Por favor, completa todos los campos correctamente';
    }
  }
}