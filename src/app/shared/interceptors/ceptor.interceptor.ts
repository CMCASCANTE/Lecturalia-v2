import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn } from '@angular/common/http';
import { HttpEvent, HttpRequest } from "@angular/common/http";
import { Observable, catchError, finalize, tap, throwError, timeout } from "rxjs";
import { OpenApiService } from '../services/apiOpen.service';
import { inject } from '@angular/core';


// Interceptor de peticiones HTTP
/**
 * 
 * @param req // HTTP request
 * @param next // paso interceptado del proceso
 * @returns // paso "modificado"
 */
export const ceptorInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  // Lógica a realizar antes de devolver la petición a su curso
  // Clonamos la request
  const request = req;
  // Injectamos el servicio de consulta http
  const service = inject(OpenApiService);
  
  // Devolvemos la petición HTTP y controlamos el flujo de la petición 
  return next(request).pipe( 
    // Lanzamos un tiempo de timeout para manejar el error si la petición no ha finalizado en ese tiempo
    //timeout(1000),

    // Estados de la petición    
    tap(() => {
      
    }),
    // Petición finalizada
    finalize(() => {      
      // Lanzamos la función del servicio de consulta http que hemos creado para indicar que se ha finalizado la request
      //service.requestStatusTogle("FINALIZADO");
    }),
    // Control de errores
    catchError((error: HttpErrorResponse) => {
      //let errorMsg = '';
      if (error.error instanceof ErrorEvent) {
        // console.log('This is client side error');
        //errorMsg = `Error: ${error.error.message}`;
      } else {
        // console.log('This is server side error');
        //errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
      }
      //console.log(errorMsg);
      return throwError(() => error);
  })
  );
};

