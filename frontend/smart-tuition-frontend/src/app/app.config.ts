import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

import { routes } from './app.routes';

export function tokenGetter() {
  return localStorage.getItem('token');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([(req, next) => {
      const token = tokenGetter();
      if (token) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      return next(req);
    }])),
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: ['localhost:8080'],
          disallowedRoutes: ['http://localhost:8080/api/auth/']
        }
      }),
      BrowserAnimationsModule,
      MatButtonModule,
      MatInputModule,
      MatCardModule,
      MatToolbarModule,
      MatSidenavModule,
      MatListModule,
      MatTableModule,
      MatPaginatorModule,
      MatSortModule,
      MatFormFieldModule,
      MatSelectModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatDialogModule,
      MatSnackBarModule,
      MatIconModule
    )
  ]
};
