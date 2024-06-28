import { Component, inject, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-google-modal',
  standalone: true,
  imports: [],
  templateUrl: './google-modal.component.html',
  styleUrl: './google-modal.component.css'
})
export class GoogleModalComponent {

  // Modal (bootstrap)  
  activeModal = inject(NgbActiveModal);
  // Recogemos los datos del libro enviados desde el buscador
  @Input() book: any;

}
