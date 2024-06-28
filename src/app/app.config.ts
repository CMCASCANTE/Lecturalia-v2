import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { provideAuth0 } from '@auth0/auth0-angular';
import { environment } from '../app/shared/constantes/environment';

import { routes } from './app.routes';
import { ceptorInterceptor } from './shared/interceptors/ceptor.interceptor';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    provideAuth0({
      domain: environment.auth.domain,
      clientId: environment.auth.clientId,
      authorizationParams: {
        redirect_uri: environment.auth.redirectUri
      }
    }),    
    provideHttpClient(withInterceptors([ceptorInterceptor])),
    importProvidersFrom(
      RecaptchaV3Module
    ),
    {provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.google.captchaKey}
  ]
};
