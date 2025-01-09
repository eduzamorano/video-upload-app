// src/app/components/videos/video-upload/video-upload.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VideoService } from '../../../services/video.service';

@Component({
  selector: 'app-video-upload',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressBarModule,
    MatIconModule
  ],
  template: `
    <div class="upload-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Subir Video</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <div 
            class="upload-zone"
            (dragover)="onDragOver($event)"
            (dragleave)="onDragLeave($event)"
            (drop)="onDrop($event)"
            [class.dragover]="isDragging"
          >
            <input
              type="file"
              #fileInput
              (change)="onFileSelected($event)"
              accept="video/*"
              style="display: none"
            >
            
            <mat-icon class="upload-icon">cloud_upload</mat-icon>
            <p>Arrastra y suelta tu video aquí o</p>
            <button 
              mat-raised-button 
              color="primary" 
              (click)="fileInput.click()"
              [disabled]="uploading"
            >
              Seleccionar Video
            </button>
          </div>

          @if (selectedFile) {
            <div class="file-info">
              <p>Archivo: {{ selectedFile.name }}</p>
              <p>Tamaño: {{ formatFileSize(selectedFile.size) }}</p>
            </div>
          }

          @if (uploading) {
            <mat-progress-bar
              mode="determinate"
              [value]="uploadProgress"
            ></mat-progress-bar>
          }
        </mat-card-content>

        <mat-card-actions>
          <button
            mat-raised-button
            color="accent"
            (click)="uploadFile()"
            [disabled]="!selectedFile || uploading"
          >
            Subir Video
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .upload-container {
      max-width: 600px;
      margin: 20px auto;
      padding: 0 20px;
    }

    .upload-zone {
      border: 2px dashed #ccc;
      border-radius: 8px;
      padding: 40px;
      text-align: center;
      margin: 20px 0;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .upload-zone.dragover {
      border-color: #3f51b5;
      background: rgba(63, 81, 181, 0.05);
    }

    .upload-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #666;
      margin-bottom: 16px;
    }

    .file-info {
      margin: 16px 0;
      padding: 16px;
      background: #f5f5f5;
      border-radius: 4px;
    }

    mat-progress-bar {
      margin-top: 16px;
    }

    button {
      margin: 8px;
    }
  `]
})
export class VideoUploadComponent {
  selectedFile: File | null = null;
  uploading = false;
  uploadProgress = 0;
  isDragging = false;

  constructor(
    private videoService: VideoService,
    private snackBar: MatSnackBar
  ) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      this.selectedFile = file;
    } else {
      this.snackBar.open('Por favor selecciona un archivo de video', 'Cerrar', {
        duration: 3000
      });
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files?.length) {
      const file = files[0];
      if (file.type.startsWith('video/')) {
        this.selectedFile = file;
      } else {
        this.snackBar.open('Por favor arrastra un archivo de video', 'Cerrar', {
          duration: 3000
        });
      }
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  uploadFile() {
    if (!this.selectedFile) return;

    this.uploading = true;
    this.videoService.uploadVideo(this.selectedFile).subscribe({
      next: (response) => {
        this.snackBar.open('Video subido exitosamente', 'Cerrar', {
          duration: 3000
        });
        this.uploading = false;
        this.selectedFile = null;
        this.uploadProgress = 0;
      },
      error: (error) => {
        console.error('Error al subir:', error);
        this.snackBar.open('Error al subir el video', 'Cerrar', {
          duration: 3000
        });
        this.uploading = false;
      }
    });
  }
}