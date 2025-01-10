// src/app/services/video.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';

// Interfaz para el Video (opcional pero recomendado)
export interface Video {
  id: number;
  title: string;
  driveFileUrl: string;
  size: number;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private apiUrl = 'http://192.168.1.83:3000/api/videos';

  constructor(private http: HttpClient) {}

  // Método para obtener el token (asumiendo que lo guardas en localStorage)
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  uploadVideo(file: File) {
    const formData = new FormData();
    formData.append('video', file);

    return this.http.post(this.apiUrl + '/upload', formData, {
      headers: this.getHeaders(),
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map(event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            const progress = event.total ? Math.round(100 * event.loaded / event.total) : 0;
            return { type: 'progress', progress };
          case HttpEventType.Response:
            return { type: 'complete', body: event.body };
          default:
            return { type: 'other' };
        }
      })
    );
  }

  // Método para obtener la lista de videos
  getVideos(): Observable<Video[]> {
    return this.http.get<Video[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  // Método para obtener un video específico
  getVideo(id: number): Observable<Video> {
    return this.http.get<Video>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  // Método para eliminar un video
  deleteVideo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }
}