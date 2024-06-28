import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { GoogleApiService } from '../shared/services/apiGoogle.service';
import { OpenApiService } from '../shared/services/apiOpen.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OpenModalComponent } from './open-modal/open-modal.component';
import { GoogleModalComponent } from './google-modal/google-modal.component';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-aplicacion',
  standalone: true,
  imports: [ ReactiveFormsModule ],
  templateUrl: './aplicacion.component.html',
  styleUrl: './aplicacion.component.css'
})
export class AplicacionComponent {
 // Variables del formulario
 searchFormGroup: any
 titleForm: any;
 autorForm: any;
 selectForm: any;
 bibliotecas: any[];
 select: any;
 title: any;
 autor: any;

 // Variables para las respuestas de la api    
 books: any[];
 nBooks: number;
 nPage: number;
 actualBook: number;
 bookRequest: any;
 bookRequestService: any;

 // Elementos del DOM
 loading: any;
 message: any;
 paginado1: any;
 paginado2: any;
 results: any;

 
 // MODALES
 private modalServiceOpen = inject(NgbModal);
 private modalServiceGoogle = inject(NgbModal);

 /**
  * Lanzamiento del MODAL para la info de los libros openlibrary
  * @param book 
  */
 openModal(book: any) {
   const modalRef = this.modalServiceOpen.open(OpenModalComponent, {modalDialogClass: 'modalCSS'});
   modalRef.componentInstance.book = book;          
 } 
 /**
  * Lanzamiento del MODAL para la info de los libros googleBooks
  * @param book 
  */
 googleModal(book: any) {
   const modalRef = this.modalServiceGoogle.open(GoogleModalComponent, {modalDialogClass: 'modalCSS'});
   modalRef.componentInstance.book = book;
 }


 @ViewChild('loading') loadingElement!: ElementRef;
 @ViewChild('message') messageElement!: ElementRef;
 @ViewChild('paginado1') paginado1Element!: ElementRef;
 @ViewChild('paginado2') paginado2Element!: ElementRef;
 @ViewChild('results') resultsElement!: ElementRef;

 ngAfterViewInit() {
   this.loading = this.loadingElement.nativeElement;
   this.message = this.messageElement.nativeElement
   this.paginado1 = this.paginado1Element.nativeElement;
   this.paginado2 = this.paginado2Element.nativeElement;
   this.results = this.resultsElement.nativeElement;
 }


 
 // Cosntructor del componente
 constructor(private sanitizer: DomSanitizer, private googleService: GoogleApiService,private openService: OpenApiService) {
   this.searchFormGroup = new FormGroup({
     titleForm: new FormControl(''),
     autorForm: new FormControl(''),
     selectForm: new FormControl('GoogleBooks')
   });    
   this.books = [];        
   this.nBooks = 0;
   this.nPage = 1;
   this.actualBook = 0;
   this.bibliotecas = [
     {biblioteca: "OpenLibrary"},
     {biblioteca: "GoogleBooks"},
   ]        
 }





 
 /**
  * Envío de los datos a la API y procesado de los elementos
  * @param paginacion // control del paginado
  */
 getBooks(paginacion: boolean){ 
  // Finalizamos la petición en curso si hay cambios en la busqueda
  // Si hemos seleccionado una librería diferente limpiamos la petición anterior
  if (this.bookRequest && this.searchFormGroup.getRawValue().selectForm != this.select) {
    this.bookRequest.unsubscribe();
  // Si  hemos cambiado el valor a buscar, tambien limpiamos
  } else if (this.bookRequest && (this.title != this.getSanitizedHtml(this.searchFormGroup.getRawValue().titleForm) || this.autor != this.getSanitizedHtml(this.searchFormGroup.getRawValue().autorForm))) {
    this.bookRequest.unsubscribe();
  }

  // Actualizamos el valor del select y guardamos el sevicio seleccionado
  // pero solo si no viene de un cambio de página
  if (!paginacion) {
    this.select = this.searchFormGroup.getRawValue().selectForm;
    this.bookRequestService = (this.select=="GoogleBooks" ? this.googleService : this.openService);  
  }

  // Con todo limpio y seleccionado, obtenemos valores y lanzamos la petición
  if (this.bookRequestService.requestStatus()) {   
    // Obtenemos y saneamos los valores del input    
    this.title = this.getSanitizedHtml(this.searchFormGroup.getRawValue().titleForm);
    this.autor = this.getSanitizedHtml(this.searchFormGroup.getRawValue().autorForm);     

    // Pasamos los valores al servicio que conecta con la API      
    this.bookRequest = (this.bookRequestService).requestParse(this.title, this.autor, this.select, this.nPage).subscribe(
      { next: (data: any) => {     

          // Si no tiene resultados
          if (data[0] == "sinResultados"){
            // vaciamos los posibles resultados
            this.books = [];
            // Quitamos el elemento de carga y mostramos un mensaje
            this.loading.style.display = "none";    
            this.message.style.display = "block";    
            this.message.getElementsByTagName("span")[0].innerHTML = "No se han encontrado resultados";
          
          } // Si tiene resultados pero no trae datos 
          else if(data[0] == "arrayVacio") {
            // vaciamos los posibles resultados
            this.books = [];
            // Quitamos el elemento de carga y mostramos un mensaje
            this.loading.style.display = "none";    
            this.message.style.display = "block";    
            this.message.getElementsByTagName("span")[0].innerHTML = "No hay mas resultados";
          
          } // Si tiene resultados y datos
          else if(data[0] > 0) {                       
            // Guardamos datos
            if (this.nBooks==0) {
              // Para el paginado de Google (comienza en 0)
              if (this.select=="GoogleBooks") {                
                this.nBooks = data[0]-1;                   
              } else {
                this.nBooks = data[0]; 
              }   
            }              
            this.books = data[1];     
            this.actualBook = data[2];                                                                     
            // Quitamos el elemento de carga y mostramos los resultados
            this.loading.style.display = "none";   
            // Si son mas de 12, mostramos el paginado, sino no
            if (this.nBooks > 12) {
              this.paginado1.style.display = "block";
              this.paginado2.style.display = "block";
              this.results.style.display = "block";  
            } else {
              this.results.style.display = "block";  
            }                 
          }            
        }, 
        error: () => {  
          this.loading.style.display = "none";    
          this.message.style.display = "block";    
          this.message.getElementsByTagName("span")[0].innerHTML = "Ha habido un error, intentalo de nuevo mas tarde";
        },
        complete: () => {
          // Una vez ha finalizado la petición...           
        } 
      }  
    )
   }    
 }
 





 /**
  * Procesado del paginado al cargar la primera búsqueda
  */
 FirstPage() {
   // ocultamos todo menos el loading    
   this.message.style.display = "none";
   this.paginado1.style.display = "none";
   this.paginado2.style.display = "none";
   this.results.style.display = "none";
   this.loading.style.display = "block";
   // reinicamos las páginas y mandamos la petición
   this.nPage = 1;
   this.nBooks = 0;
   this.getBooks(false);
 }
 
 /**
  * Procesado del paginado al pasar página
  */
 pageUp() {      
   // Si no hay petición en proceso lanzamos una
   if ((this.select=="GoogleBooks" ? this.googleService : this.openService).requestStatus()){        
     // Comprobamos que queden mas de 10 resultados para pedir la siguiente página
     if ((this.actualBook+12) >= this.nBooks || this.books.length<12) {
       
     } else {        
       // le damos al loading que vamso a cargar el tamaño del div de resultados para que no se note la transicion con el footer        
       this.loading.style.height = this.results.offsetHeight + 'px';
       // Ocultamos todo menos el loading y el paginado superior
       this.message.style.display = "none";        
       this.paginado2.style.display = "none";
       this.results.style.display = "none";
       this.loading.style.display = "block";
       
       // añadimos una pagina y lanzamos la petición
       ++this.nPage;    
       this.getBooks(true);}
   }
 } 
 /**
  * Procesado del paginado al volver a la página anterior
  */
 pageDown() {    
   // Si no hay petición en proceso lanzamos una
   if ((this.select=="GoogleBooks" ? this.googleService : this.openService).requestStatus()){
     // Comprobamos que no estemos en la primera página
     if (this.nPage <= 1) {
       
     } else {
       // le damos al loading que vamso a cargar el tamaño del div de resultados para que no se note la transicion con el footer        
       this.loading.style.height = this.results.offsetHeight + 'px';
       // Ocultamos todo menos el loading y el paginado superior
       this.message.style.display = "none";        
       this.paginado2.style.display = "none";
       this.results.style.display = "none";
       this.loading.style.display = "block";
       // Restamos una página y lanzamos la petición
       --this.nPage;   
       this.getBooks(true);
     }
   }
 }



 
 /**
   * sanetizado de los elementos html
   * @param str // cadena de caracteres original
   * @returns // cadena de caracteres limpia
   */
 getSanitizedHtml(str: string) {
  // Eliminamos comillas y sanetizamos
  const sanStr = str.replace(/['"`]+/g, '');
  return this.sanitizer.sanitize(1, sanStr);
}






 
 /**
  * Limpieza de request de datos al cambiar componente
  */
 ngOnDestroy(){
  if (this.bookRequest) {
    this.bookRequest.unsubscribe();
  }  
 }

 

}
