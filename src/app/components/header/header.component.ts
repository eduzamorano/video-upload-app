// src/app/components/header/header.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  template: `
    <mat-toolbar color="primary">
      <span class="logo" routerLink="/">Video App</span>
      
      <span class="spacer"></span>

      @if (authService.user$ | async) {
        <div class="menu-container">
          <!-- Menú móvil -->
          <button 
            mat-icon-button 
            [matMenuTriggerFor]="mobileMenu" 
            class="mobile-menu-button"
          >
            <mat-icon>menu</mat-icon>
          </button>

          <mat-menu #mobileMenu="matMenu">
            <a mat-menu-item routerLink="/videos">
              <mat-icon>video_library</mat-icon>
              <span>Mis Videos</span>
            </a>
            <a mat-menu-item routerLink="/upload">
              <mat-icon>upload</mat-icon>
              <span>Subir Video</span>
            </a>
            <button mat-menu-item (click)="onLogout()">
              <mat-icon>logout</mat-icon>
              <span>Salir</span>
            </button>
          </mat-menu>

          <!-- Menú desktop -->
          <div class="desktop-menu">
            <a mat-button routerLink="/videos">
              <mat-icon>video_library</mat-icon>
              Mis Videos
            </a>
            <a mat-button routerLink="/upload">
              <mat-icon>upload</mat-icon>
              Subir Video
            </a>
            <button mat-button (click)="onLogout()">
              <mat-icon>logout</mat-icon>
              Salir
            </button>
          </div>
        </div>
      }
    </mat-toolbar>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }

    .logo {
      cursor: pointer;
      font-size: 1.2em;
      font-weight: 500;
    }

    .menu-container {
      display: flex;
      align-items: center;
    }

    .desktop-menu {
      display: none;
    }

    .mobile-menu-button {
      display: block;
    }

    @media (min-width: 768px) {
      .desktop-menu {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .mobile-menu-button {
        display: none;
      }
    }

    mat-icon {
      vertical-align: middle;
      margin-right: 8px;
    }

    .mat-menu-item mat-icon {
      margin-right: 8px;
    }
  `]
})
export class HeaderComponent {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}