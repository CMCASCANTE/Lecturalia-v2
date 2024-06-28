import { Component, ElementRef, ViewChild, Inject } from '@angular/core';

// Imports para el ruteo del navegador
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

// Import para estilos Bootstrap del navegador
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { filter } from 'rxjs';

// Importación del servicio de autenticación de ath0 y del document 
import { AuthService } from '@auth0/auth0-angular';
import { CommonModule, DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgbDropdownModule, NgbNavModule, CommonModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',  
})
export class AppComponent {
  // Guardar elementos del DOM
  navList: any;
  dropList: any;
  
  @ViewChild('navList') navListElement!: ElementRef; 
  @ViewChild('dropList') dropListElement!: ElementRef; 
  ngAfterViewInit() {
    this.navList = this.navListElement!.nativeElement;
    this.dropList = this.dropListElement!.nativeElement;    
  }

  // Constructor
  // Añadimos el router
  // Injectamos el modulo de auth0 en el componente desde el constructor
  constructor(private route: ActivatedRoute, private router: Router, @Inject(DOCUMENT) public document: Document, public auth: AuthService) {
   
  }

  
  /**
   * Remarcar los lementos del menú al cargar la página
   * Funcion necesaria para activar los estilos de los enlaces del menú (quitados por dirigir con las rutas del outlet)
   */
  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if(event.url=="/inicio" || event.url=="/aplicacion" || event.url=="/contacto" || event.url=="/login") {
          document.querySelector("[routerLink='"+event.url+"']")?.classList.add('active');
        } else if(event.url=="/subMenu" || event.url=="/subMenu2" || event.url=="/subMenuExtra") {
          this.activSubMenu();
        } else {
          document.querySelector("[routerLink='/inicio']")?.classList.add('active');
        }
      });
  }
  // 
  /**
   * Accion para boton de menu principal
   * @param element // elemento del boton
   */
  activMenu(element: any): void{    
    for (let item of this.navList.getElementsByTagName("a")){
      item.classList.remove("active")  
    }
    element.srcElement.classList.add("active")
  }
  
  /**
   * Accion para boton del sub-menu
   */
  activSubMenu(): void{    
    for (let item of this.navList.getElementsByTagName("a")){
      item.classList.remove("active")  
    }
    this.dropList.classList.add("active")
  } 

  /**
   * Funcion para la acción del menu
   */
  action(){
    alert('Estamos trabajando en ello');
  }
}
