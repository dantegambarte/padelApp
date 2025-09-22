import {
  AsyncPipe,
  CurrencyPipe,
  DatePipe,
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
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ReservationsPageFacade } from '../../pages/reservations-page/reservations-page.facade';

@Component({
  selector: 'reservations-admin-tab',
  standalone: true,
  imports: [
    AsyncPipe,
    CurrencyPipe,
    NgClass,
    NgFor,
    NgIf,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTableModule,
    MatTooltipModule,
    DatePipe,
  ],
  templateUrl: './reservations-admin-tab.component.html',
  styleUrls: ['./reservations-admin-tab.component.scss'],
})
export class ReservationsAdminTabComponent {
  protected readonly facade = inject(ReservationsPageFacade);
}
