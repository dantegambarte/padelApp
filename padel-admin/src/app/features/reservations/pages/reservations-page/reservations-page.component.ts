import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Reservation } from '../../../../shared/models/reservation';
import { ReservationService } from '../../services/reservation.service';
import { AsyncPipe, CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-reservations-page',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    DatePipe,
    CurrencyPipe,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './reservations-page.component.html',
  styleUrl: './reservations-page.component.scss',
})
export class ReservationsPageComponent {
  reservas$: Observable<Reservation[]> = this.reservationService.reservas$;
  cols = ['court', 'date', 'time', 'players', 'deposit', 'status', 'actions'];

  constructor(private reservationService: ReservationService) {}

  cancel(r: Reservation) {
    this.reservationService.remove(r.id).subscribe();
  }
}
