// src/app/services/video.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private apiUrl = 'http://192.168.1.83:3000/api/videos';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  uploadVideo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('video', file);

    return this.http.post(`${this.apiUrl}/upload`, formData, {
      headers: this.getHeaders()
    });
  }

  getVideos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }
}