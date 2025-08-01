import {
  ApplicationConfig,
  ErrorHandler,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';
import CustomThemePreset from './custom-theme-preset';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { loaderInterceptor } from '../service/interceptors/loader.interceptor';
import { ConfirmationService, MessageService } from 'primeng/api';
import { GlobalErrorHandler } from '../service/handlers/error.handler';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: CustomThemePreset,
      },
      ripple: true,
    }),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([loaderInterceptor])),
    MessageService,
    ConfirmationService,
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
};
