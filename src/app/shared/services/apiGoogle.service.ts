import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, finalize, map } from 'rxjs';
import { environment } from '../constantes/environment';


@Injectable({
  providedIn: 'root'
})
export class GoogleApiService {
  // Declaración de variables para el service
  // Keys y endpoints // La key la cogemos de las constantes compartidas en la carpeta shared
  private key = environment.google.apiKey;
  private googleEndpoint: string;      
  // Estado de la petición
  private requestComplete: boolean;

  // Variables para los datos
  private resultados: any;
  private libros: any;
  private pagina: any;  


  
  // Constructor, le añadimos la petición http e inciamos las variables
  constructor(
    private http: HttpClient) {            
    // Endpoint de google books
    this.googleEndpoint = 'https://www.googleapis.com/books/v1/volumes';
    // Comprobador de estado de la request
    this.requestComplete = true;
    // Variables
    this.resultados = 0;
    this.pagina = 0;
    this.libros = [];    
  }





  /**
   * Preparación de la petición HTTP 
   * @param titulo // parametro de busqueda
   * @param autor // parametro de busqueda
   * @param api // biblioteca seleccionada
   * @param pag // parametro de busqueda
   * @returns // respuesta de la biblioteca con los resultados correspondientes
   */
  requestParse(titulo: string | null, autor: string | null, api: string, pag: number): Observable<any>  {    
    // Lo primero indicamos que la consulta esta en proceso con la variable de control
    this.requestStart();       
    // Comprobamos que se ha solicitado la API correcta
    if (api=="GoogleBooks") {
      // procesado de paginado
      pag==1?pag=0:pag=(pag-1)*12;
      // Petición
      return this.googleRequest(titulo, autor, pag).pipe(
                map(
                  (data: any) => {                    
                    this.resultados = data.totalItems;
                    this.pagina = pag;
                    this.libros = data.items;                    
                    if (this.resultados != 0) {
                      if (this.libros.length) {
                        // Guardamos datos
                        data = [ this.resultados, this.libros, this.pagina ];                        
                      } else {
                        data = [ "arrayVacio" ];
                      }       
                    } else {
                      data = [ "sinResultados" ];
                    }             
                    return data; // Devolvemos los nuevos datos para el subscribe            
                  }          
                ),       
                // Petición finalizada
                finalize(() => {      
                  // Indicamos que la petición ha finalizado                    
                  this.requestFinish(); 
                }),
      )
    } else {
      return EMPTY;
    }
  }

  




  /**
   * Envío de la petición HTTP
   * @param titulo // parametro de busqueda
   * @param autor // parametro de busqueda
   * @param pag // parametro de busqueda
   * @returns // respuesta de la biblioteca con los resultados correspondientes
   */
  googleRequest(titulo: string | null, autor: string | null, pag: number): Observable<HttpRequest<any>> {       
      // Lanzamos la consulta y la devolvemos      
      return this.http.get<HttpRequest<any>>(`${this.googleEndpoint}?q="${titulo}"+inauthor:'${autor}'&startIndex=${pag}&maxResults=12&key=${this.key}`);        
  }







  /**
   * Obtener estado de la variable de comprobación de request
   * @returns // estado 
   */
  requestStatus(): boolean {
    return this.requestComplete;
  }
  /**
   * cambiar estado de la variable de comprobación a iniciado (false)
   */
  requestStart() {
    this.requestComplete = false;
  }
  /**
   * cambiar estado de la variable de comprobación a finalizado (true)
   */
  requestFinish() {
    this.requestComplete = true;
  }
}