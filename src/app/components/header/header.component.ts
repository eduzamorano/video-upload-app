// src/app/components/header/header.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <mat-toolbar color="primary">
      <span class="logo" routerLink="/">Video App</span>
      
      <span class="spacer"></span>

      @if (authService.user$ | async) {
        <nav>
          <a mat-button routerLink="/videos">
            <mat-icon>video_library</mat-icon>
            Mis Videos
          </a>
          <a mat-button routerLink="/upload">
            <mat-icon>upload</mat-icon>
            Subir Video
          </a>
          <button mat-button (click)="logout()">
            <mat-icon>logout</mat-icon>
            Salir
          </button>
        </nav>
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

    nav {
      display: flex;
      gap: 8px;
    }

    mat-icon {
      margin-right: 4px;
    }

    @media (max-width: 600px) {
      .mat-button-base {
        padding: 0 8px;
      }
      
      mat-icon {
        margin-right: 0;
      }

      .mat-button-base ::ng-deep .mat-button-wrapper span {
        display: none;
      }
    }
  `]
})
export class HeaderComponent {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}