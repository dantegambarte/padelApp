import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';

import { ReservationsPageFacade } from '../../pages/reservations-page/reservations-page.facade';

@Component({
  selector: 'reservations-header',
  standalone: true,
  imports: [AsyncPipe, NgIf, MatButtonToggleModule, MatIconModule],
  templateUrl: './reservations-header.component.html',
  styleUrls: ['./reservations-header.component.scss'],
})
export class ReservationsHeaderComponent {
  protected readonly facade = inject(ReservationsPageFacade);
}
