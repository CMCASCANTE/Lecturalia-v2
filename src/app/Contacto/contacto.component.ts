import { Component, ElementRef, ViewChild, inject } from "@angular/core";
import { SendDataService } from "../shared/services/sendData.service";
import { DomSanitizer } from "@angular/platform-browser";
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ReCaptchaV3Service } from "ng-recaptcha";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../shared/constantes/environment";
import { ReCaptchaVerifyService } from '../shared/services/re-captcha-verify.service';


@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [ ReactiveFormsModule ],  
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})
export class ContactoComponent {
  // Variables del componente
  nameForm: any;
  comentForm: any;  
  successMessage: string = "";
    

  // Google recaptcha
  recaptchaGoogle =  inject(ReCaptchaV3Service);
  recaptchaGoogleResponse: any;

  // Elementos del DOM
  inpNombre: any;
  inpComentario: any;
  enviado: any;

  @ViewChild('inputNombre') nombreElement!: ElementRef;
  @ViewChild('inputComentario') comentarioElement!: ElementRef;  
  @ViewChild('enviado') enviadoElement!: ElementRef;
  ngAfterViewInit() {
      this.inpNombre = this.nombreElement.nativeElement;
      this.inpComentario = this.comentarioElement.nativeElement;    
      this.enviado = this.enviadoElement.nativeElement;      
  }
    
  // Contructor
  constructor( private apiService: SendDataService, private sanitizer: DomSanitizer, private http: HttpClient, private reCaptchaBack: ReCaptchaVerifyService ) {
    this.nameForm = new FormControl('');
    this.comentForm = new FormControl('');
  }

  
  /**
   * Procesado de los datos del formulario de contacto
   */
  trySend(){   
    // Saneo de los datos
    const nombre = this.getSanitizedHtml(this.nameForm.getRawValue())
    const comentario = this.getSanitizedHtml(this.comentForm.getRawValue())

    // Eliminamos las clases de los elementos por si tenemos que volver a añadirlas
    this.inpNombre.classList.remove("mostrarMensaje");
    this.inpNombre.offsetWidth;
    this.inpComentario.classList.remove("mostrarMensaje");
    this.inpComentario.offsetWidth;
    this.enviado.classList.remove("mostrarMensaje");
    this.enviado.classList.remove("mostrarMensajeEspera");
    this.enviado.offsetWidth;

    // Limpiamos el formulario
    this.inpNombre.innerHTML = "";
    this.inpComentario.innerHTML = "";
    this.enviado.innerHTML = "";
    this.nameForm.setValue("");
    this.comentForm.setValue("")

    // Mostramos mensaje de espera
    this.enviado.innerHTML = "Enviando..."; 
    this.enviado.classList.add("mostrarMensajeEspera");
    
    

    // Comprobamos que no esten vacíos
    if (nombre == "" || nombre == null) {
      this.inpComentario.innerHTML = "";      
      this.inpNombre.innerHTML = "Tienes que indicar un Nombre!!";
      this.inpNombre.classList.add("mostrarMensaje");      
      
    } else if (comentario == "" || comentario == null) {
      this.inpNombre.innerHTML = "";
      this.inpComentario.innerHTML = "Tienes que introducir un comentario!!!"
      this.inpComentario.classList.add("mostrarMensaje");
    } else {
      // Si no estan vacíos
      // Comprobamos que el captcha de google sea correcto
      this.recaptchaGoogle.execute('').subscribe((token) => {  
        // Lanzamos el servicio que consulta la verificación desde el servidor
        this.reCaptchaBack.recaptchaVerify(environment.google.secretCaptchaKey, token).subscribe({
          next: (data: any) => {
          // procesamos la respuesta buscando el valor del key success
          Object.entries(data).forEach(([key, value]) => {
            if (key === 'success'){
              this.recaptchaGoogleResponse = value;
            }
          });

          // si es correcta, envianmos los datos
          if (this.recaptchaGoogleResponse) {
            // Enviamos los datos
            this.sendData(nombre, comentario)
            
          // si no es correcta, es que eres un bot
          } else {
            this.enviado.innerHTML = "Segun google eres un bot :/";
          }          
        },
        error: () => {
          // Manejo de la respuesta de error
          this.enviado.classList.remove("mostrarMensajeEspera");
          this.enviado.innerHTML = "Ha habido un error, intentalo de nuevo mas tarde...";
          this.enviado.classList.add("mostrarMensaje");        
        },
        complete: () => {
          // Manejo de petición completada
        }
      });             
      })
      
    }
  }




  
  /**
   * Envío de los datos al servicio correspondiente
   * @param nombre // parametro del formulario
   * @param comentario // parametro del formulario
   */
  sendData(nombre: string, comentario: string): void {    
    // Datos del formulario
    const formData = new FormData();    
    // Añadir los datos al formData
    formData.append("nombre", nombre);
    formData.append("texto", comentario);    
    
    // Lanzar petición
    this.apiService.sendFormData(formData).subscribe({
      next: (response: any) => {        
        //Si la respuesta es mensaje enviado...
        if (response === "Message has been sent") {       
          this.enviado.classList.remove("mostrarMensajeEspera");   
          this.enviado.innerHTML = "Mensaje Enviado!!";
          this.enviado.classList.add("mostrarMensaje");
        } else {
          this.enviado.classList.remove("mostrarMensajeEspera");
          this.enviado.innerHTML = "Ha habido un error, intentalo de nuevo mas tarde...";
          this.enviado.classList.add("mostrarMensaje");
        }
        
      },
      error: () => {
        // Manejo de la respuesta de error
        this.enviado.classList.remove("mostrarMensajeEspera");
        this.enviado.innerHTML = "Ha habido un error, intentalo de nuevo mas tarde...";
        this.enviado.classList.add("mostrarMensaje");        
      },
      complete: () => {
        // Manejo de petición completada
      }
    });
    
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
}