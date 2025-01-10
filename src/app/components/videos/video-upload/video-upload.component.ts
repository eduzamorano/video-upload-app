// src/app/components/videos/video-upload/video-upload.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { VideoService } from '../../../services/video.service';

@Component({
  selector: 'app-video-upload',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressBarModule,
    MatIconModule,
    MatSnackBarModule
  ],
  template: `
    <div class="upload-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Subir Video</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          @if (message) {
            <div class="message" [class]="messageType">
              {{ message }}
            </div>
          }

          <input
            type="file"
            (change)="onFileSelected($event)"
            class="file-input"
            [disabled]="uploading"
          >

          @if (selectedFile) {
            <div class="file-info">
              <p>Video seleccionado: {{ selectedFile.name }}</p>
              <p>Tamaño: {{ formatFileSize(selectedFile.size) }}</p>
              
              <button
                mat-raised-button
                color="primary"
                (click)="uploadFile()"
                [disabled]="uploading"
              >
                @if (uploading) {
                  Subiendo...
                } @else {
                  Subir Video
                }
              </button>
            </div>
          }

          @if (uploading) {
            <div class="progress-container">
              <mat-progress-bar
                mode="determinate"
                [value]="uploadProgress"
              ></mat-progress-bar>
              <p>Progreso: {{ uploadProgress }}%</p>
            </div>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .upload-container {
      padding: 16px;
      max-width: 600px;
      margin: 0 auto;
    }

    .file-input {
      margin: 16px 0;
      width: 100%;
      padding: 8px;
    }

    .file-info {
      margin: 16px 0;
      padding: 16px;
      background: #f5f5f5;
      border-radius: 4px;
    }

    .progress-container {
      margin: 16px 0;
    }

    .progress-container p {
      text-align: center;
      margin: 8px 0;
    }

    button {
      width: 100%;
      margin-top: 16px;
    }

    .message {
      padding: 12px;
      border-radius: 4px;
      margin: 16px 0;
      text-align: center;
    }

    .success {
      background-color: #e8f5e9;
      color: #2e7d32;
    }

    .error {
      background-color: #ffebee;
      color: #c62828;
    }
  `]
})
export class VideoUploadComponent {
  selectedFile: File | null = null;
  uploading = false;
  uploadProgress = 0;
  message = '';
  messageType = '';

  constructor(
    private videoService: VideoService,
    private snackBar: MatSnackBar
  ) {}

  onFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      // Resetear mensajes
      this.message = '';
      this.messageType = '';
      this.selectedFile = file;
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  resetForm() {
    // Limpiar el input de archivo
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    this.selectedFile = null;
    this.uploadProgress = 0;
  }

  uploadFile() {
    if (!this.selectedFile) return;

    this.uploading = true;
    this.message = '';
    this.messageType = '';

    this.videoService.uploadVideo(this.selectedFile).subscribe({
      next: (event: any) => {
        if (event.type === 'progress') {
          this.uploadProgress = event.progress;
        } else if (event.type === 'complete') {
          this.uploading = false;
          this.message = '¡Video subido exitosamente! Puedes subir otro video si lo deseas.';
          this.messageType = 'success';
          this.resetForm();
        }
      },
      error: (error) => {
        console.error('Error al subir:', error);
        this.uploading = false;
        this.message = 'Error al subir el video. Por favor, intenta nuevamente.';
        this.messageType = 'error';
        this.uploadProgress = 0;
      }
    });
  }
}