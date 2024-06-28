import { Component, inject, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-open-modal',
  standalone: true,
  imports: [],
  templateUrl: './open-modal.component.html',
  styleUrl: './open-modal.component.css'
})
export class OpenModalComponent {

  // Modal (bootstrap)  
  activeModal = inject(NgbActiveModal);
  // Recogemos los datos del libro enviados desde el buscador
  @Input() book: any;
  
}
