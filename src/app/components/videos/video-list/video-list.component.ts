// src/app/components/videos/video-list/video-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { VideoService } from '../../../services/video.service';

@Component({
  selector: 'app-video-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="video-list-container">
      <div class="header">
        <h1>Mis Videos</h1>
        <button mat-raised-button color="primary" routerLink="/upload">
          <mat-icon>add</mat-icon>
          Subir Video
        </button>
      </div>

      @if (loading) {
        <p>Cargando videos...</p>
      } @else if (videos.length === 0) {
        <mat-card>
          <mat-card-content>
            <p class="no-videos">No hay videos subidos aún.</p>
          </mat-card-content>
        </mat-card>
      } @else {
        <div class="video-grid">
          @for (video of videos; track video.id) {
            <mat-card class="video-card">
              <mat-card-header>
                <mat-card-title>{{ video.title }}</mat-card-title>
                <mat-card-subtitle>
                  Subido: {{ video.createdAt | date }}
                </mat-card-subtitle>
              </mat-card-header>
              
              <mat-card-content>
                <div class="video-info">
                  <p>Tamaño: {{ formatFileSize(video.size) }}</p>
                  <a [href]="video.driveFileUrl" target="_blank" 
                     mat-button color="primary">
                    Ver Video
                  </a>
                </div>
              </mat-card-content>
            </mat-card>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .video-list-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .video-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .video-card {
      height: 100%;
    }

    .video-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 16px;
    }

    .no-videos {
      text-align: center;
      color: #666;
      margin: 40px 0;
    }
  `]
})
export class VideoListComponent implements OnInit {
  videos: any[] = [];
  loading = true;

  constructor(private videoService: VideoService) {}

  ngOnInit() {
    this.loadVideos();
  }

  loadVideos() {
    this.videoService.getVideos().subscribe({
      next: (videos) => {
        this.videos = videos;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar videos:', error);
        this.loading = false;
      }
    });
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}