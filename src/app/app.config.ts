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
import { authInterceptor } from '../service/interceptors/auth.interceptor';
import { ptBrLocale } from './locales/pt-br.locale';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      translation: ptBrLocale,
      theme: {
        preset: CustomThemePreset,
      },
      ripple: true,
    }),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([loaderInterceptor, authInterceptor])),
    MessageService,
    ConfirmationService,
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
};
