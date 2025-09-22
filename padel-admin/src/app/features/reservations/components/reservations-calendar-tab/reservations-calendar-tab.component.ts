import {
  AsyncPipe,
  CurrencyPipe,
  DatePipe,
  DecimalPipe,
  NgClass,
  NgFor,
  NgIf,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault,
} from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ReservationsPageFacade } from '../../pages/reservations-page/reservations-page.facade';

@Component({
  selector: 'reservations-calendar-tab',
  standalone: true,
  imports: [
    AsyncPipe,
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
    NgClass,
    NgFor,
    NgIf,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    MatCardModule,
    MatChipsModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatIconModule,
    MatListModule,
    MatTooltipModule,
  ],
  templateUrl: './reservations-calendar-tab.component.html',
  styleUrls: ['./reservations-calendar-tab.component.scss'],
})
export class ReservationsCalendarTabComponent {
  protected readonly facade = inject(ReservationsPageFacade);
}
