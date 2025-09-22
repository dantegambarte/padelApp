import {
  AsyncPipe,
  CurrencyPipe,
  DecimalPipe,
  NgClass,
  NgFor,
  NgIf,
} from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { ReservationsPageFacade } from '../../pages/reservations-page/reservations-page.facade';

@Component({
  selector: 'reservation-create-form',
  standalone: true,
  imports: [
    AsyncPipe,
    CurrencyPipe,
    DecimalPipe,
    NgFor,
    NgIf,
    NgClass,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSlideToggleModule,
  ],
  templateUrl: './reservation-create-form.component.html',
  styleUrls: ['./reservation-create-form.component.scss'],
})
export class ReservationCreateFormComponent {
  protected readonly facade = inject(ReservationsPageFacade);

  reserve(payDeposit: boolean) {
    this.facade.setPayDeposit(payDeposit);
    this.facade.submitReservation();
  }
}
