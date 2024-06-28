import { Component, Inject } from '@angular/core';

// Importación del servicio de autenticación de ath0 y del document 
import { AuthService } from '@auth0/auth0-angular';
import { CommonModule, DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  // injectamos el modulo de auth0 en el componente desde el constructor
  constructor(@Inject(DOCUMENT) public document: Document, public auth: AuthService) {}
}
