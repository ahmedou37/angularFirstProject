import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptorFn } from './services/interceptor/auth-interceptor';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { provideNativeDateAdapter } from '@angular/material/core';
import { providePrimeNG } from 'primeng/config';
import Lara from "@primeng/themes/lara";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptorFn])), provideCharts(withDefaultRegisterables()),
    provideNativeDateAdapter(),
    provideAnimationsAsync(),
        providePrimeNG({
            theme: {
                preset: Lara,
                options:{
                    dark:false,
                    cssLayer: true
                }
            }
        })
   ]
};


