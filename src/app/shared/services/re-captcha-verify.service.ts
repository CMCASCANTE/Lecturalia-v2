import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpRequest } from "@angular/common/http";
import { catchError, finalize, map, timeout } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ReCaptchaVerifyService {

  constructor(private http: HttpClient) { }

  /**
   * Envío del token recaptcha para su verificación desde el lado del servidor
   * @param secret // Clave secreta de gRecaptcha
   * @param token // token generado por google
   * @returns // respuesta desde el servidor sobre la verificación
   */
  recaptchaVerify(secret: string, token: string) {
    // valores para la request
    const options = {      
      method: 'POST',
      path: 'https://lawebdekarlos.es/services/recaptchaService.php',
    };
    const httpOptions = new HttpHeaders({
        'Content-Type':  'application/json',        
        'Access-Control-Allow-Origin': '*'
    });

    // Request
    const postRequest = this.http.request<HttpRequest<any>>(options.method, options.path, {body: {secret: secret, respuesta: token}, headers: httpOptions, responseType: 'json'});        
    // Devolver request        
    return postRequest;
  }
}
