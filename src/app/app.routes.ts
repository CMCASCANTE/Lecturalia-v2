import { Routes } from '@angular/router';

// Importaciones de componentes
import { InicioComponent } from './Inicio/inicio.component';
import { AplicacionComponent } from './Aplicacion/aplicacion.component';
import { ContactoComponent } from './Contacto/contacto.component';
import { NotFound404Component } from './not-found404/not-found404.component';
import { SubmenuComponent } from './Biblioteca/submenu/submenu.component';
import { SubmenuExtraComponent } from './Biblioteca/submenu-extra/submenu-extra.component';
import { Submenu2Component } from './Biblioteca/submenu2/submenu2.component';
import { LoginComponent } from './Login/login.component';


export const routes: Routes = [
    // Rutas de navegación
    { path: '', redirectTo: '/inicio', pathMatch: 'full' }, // Ruta por defecto
    { path: 'inicio', title: "Inicio", component: InicioComponent }, // Ruta para componente Inicio
    { path: 'aplicacion', title: "Buscador", component: AplicacionComponent }, // Ruta para componente Aplicacion
    { path: 'contacto', title: "Contacto", component: ContactoComponent }, // Ruta para componente Contacto
    { path: 'subMenu', title: "Submenu", component: SubmenuComponent }, // Ruta para componente Buscador
    { path: 'subMenu2', title: "SubMenu 2", component: Submenu2Component }, // Ruta para componente subMenu2
    { path: 'subMenuExtra', title: "SubMenu Extra", component: SubmenuExtraComponent }, // Ruta para componente subMenuExtra
    { path: 'login', title: "Login", component: LoginComponent }, // Ruta para componente Login
    { path: '**', component: NotFound404Component} // Ruta para URLs que no existen
];
