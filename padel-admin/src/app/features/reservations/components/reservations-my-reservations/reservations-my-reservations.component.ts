import {
  AsyncPipe,
  CurrencyPipe,
  DatePipe,
  NgClass,
  NgFor,
  NgIf,
} from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ReservationsPageFacade } from '../../pages/reservations-page/reservations-page.facade';

@Component({
  selector: 'reservations-my-reservations',
  standalone: true,
  imports: [
    AsyncPipe,
    NgClass,
    NgIf,
    MatBadgeModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
    CurrencyPipe,
    DatePipe,
  ],
  templateUrl: './reservations-my-reservations.component.html',
  styleUrls: ['./reservations-my-reservations.component.scss'],
})
export class ReservationsMyReservationsComponent {
  protected readonly facade = inject(ReservationsPageFacade);
}
