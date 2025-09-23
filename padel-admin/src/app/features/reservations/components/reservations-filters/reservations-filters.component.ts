import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ReservationsPageFacade } from '../../pages/reservations-page/reservations-page.facade';

@Component({
  selector: 'reservations-filters',
  standalone: true,
  imports: [
    AsyncPipe,
    NgFor,
    NgIf,
    ReactiveFormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  templateUrl: './reservations-filters.component.html',
  styleUrls: ['./reservations-filters.component.scss'],
})
export class ReservationsFiltersComponent {
  protected readonly facade = inject(ReservationsPageFacade);

  protected onMonthSelected(date: Date, datepicker: MatDatepicker<Date>) {
    this.facade.onMonthSelected(date);
    datepicker.close();
  }
}
