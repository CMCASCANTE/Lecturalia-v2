import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, finalize, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class OpenApiService {
  // Declaración de variables para el service
  // Endpoint  
  private openEndpoint: string;  
  // Estado de la petición
  private requestComplete: boolean;

  // Variables para los datos
  private resultados: any;
  private libros: any;
  private pagina: any;  


  
  // Constructor, le añadimos la petición http e inciamos las variables
  constructor(    
    private http: HttpClient) {    
    // Endpoint de Open books
    this.openEndpoint = 'https://openlibrary.org/search.json';
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
    if (api=="OpenLibrary") {      
      // Lanzamos la peticion y recogemos los datos, guardandolos si hay resultados
      return this.openRequest(titulo, autor, pag).pipe(
                map(
                  (data: any) => {
                    this.resultados = data.numFound;
                    this.pagina = data.start;
                    this.libros = data.docs;                    
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
  openRequest(titulo: string | null, autor: string | null, pag: number): Observable<HttpRequest<any>> {
      // Consultas según los datos introducidos      
      if (!titulo && autor) {
          return this.http.request<HttpRequest<any>>('GET', `${this.openEndpoint}?author="${autor}"&page=${pag}&limit=12`, {responseType: 'json'});        
      } else if (titulo && !autor) {
          return this.http.request<HttpRequest<any>>('GET', `${this.openEndpoint}?title="${titulo}"&page=${pag}&limit=12`, {responseType: 'json'});
      } else if (titulo && autor) {
          return this.http.request<HttpRequest<any>>('GET', `${this.openEndpoint}?title="${titulo}"&author="${autor}"&page=${pag}&limit=12`, {responseType: 'json'});
      } else {            
          return this.http.request<HttpRequest<any>>('GET', `${this.openEndpoint}?title=""&author=""&page=${pag}&limit=12`, {responseType: 'json'});
      }
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