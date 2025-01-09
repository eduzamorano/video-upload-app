// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

interface LoginResponse {
  token: string;
  user: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://192.168.1.83:3000/api/users';
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    console.log(typeof window)
    console.log("ZAMORANO")
    if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    if (user) {
      this.userSubject.next(JSON.parse(user));
      }
    }
    
  }

  login(credentials: {email: string, password: string}): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.userSubject.next(response.user);
      })
    );
  }

  getToken(): string | null | undefined{
    if (typeof window !== 'undefined') {
    
      return localStorage.getItem('token');
    }
    return null
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }
}