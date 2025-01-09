// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { VideoListComponent } from './components/videos/video-list/video-list.component';
import { VideoUploadComponent } from './components/videos/video-upload/video-upload.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'videos', 
    component: VideoListComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'upload', 
    component: VideoUploadComponent,
    canActivate: [authGuard]
  },
  { path: '', redirectTo: '/videos', pathMatch: 'full' }
];