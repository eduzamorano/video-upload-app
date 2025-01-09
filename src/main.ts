import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { HttpClientExportsModule } from './app/http-client.module';
import { HttpClientModule } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  ...appConfig,
  imports: [HttpClientExportsModule, HttpClientModule
  ]
} as any)
  .catch((err) => console.error(err));