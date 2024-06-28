import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpRequest } from "@angular/common/http";
import { catchError, finalize, map, timeout } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class SendDataService {

  // Constructor
  constructor(private http: HttpClient) {}

  /**
   * Envío del formulario
   * @param formData // datos formulario
   * @returns // respuesta del servidor
   */
  sendFormData(formData: FormData) {
    // valores para la request
    const options = {      
      method: 'POST',
      path: 'https://lawebdekarlos.es/services/sendMail.php',
    };

    // Request
    const postRequest = this.http.request<HttpRequest<any>>(options.method, options.path, {body: formData, responseType: 'json'});        
    // Devolver request
    //const postRequest = this.http.post(this.baseUrl, formData);        
    return postRequest;
  }
}