import { domain, clientId, googleBooksApiKey, googleReCaptchaKey, googleReCaptchaKeySecret } from '../../../../configVariables.json';

/**
 * Obtención de variables localizadas en el archivo de configuración configVariables.json
 */
export const environment = {
    production: false,
    google: {
      apiKey: googleBooksApiKey,      
      captchaKey: googleReCaptchaKey,
      secretCaptchaKey: googleReCaptchaKeySecret
    },
    auth: {      
      domain,
      clientId,
      redirectUri: window.location.origin,
    },
  };