import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';

import { ReservationsPageFacade } from './reservations-page.facade';
import { ReservationsHeaderComponent } from '../../components/reservations-header/reservations-header.component';
import { ReservationsFiltersComponent } from '../../components/reservations-filters/reservations-filters.component';
import { ReservationsCalendarTabComponent } from '../../components/reservations-calendar-tab/reservations-calendar-tab.component';
import { ReservationCreateFormComponent } from '../../components/reservation-create-form/reservation-create-form.component';
import { ReservationsMyReservationsComponent } from '../../components/reservations-my-reservations/reservations-my-reservations.component';
import { ReservationsAdminTabComponent } from '../../components/reservations-admin-tab/reservations-admin-tab.component';

@Component({
  selector: 'app-reservations-page',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    MatTabsModule,
    ReservationsHeaderComponent,
    ReservationsFiltersComponent,
    ReservationsCalendarTabComponent,
    ReservationCreateFormComponent,
    ReservationsMyReservationsComponent,
    ReservationsAdminTabComponent,
  ],
  templateUrl: './reservations-page.component.html',
  styleUrls: ['./reservations-page.component.scss'],
  providers: [ReservationsPageFacade],
})
export class ReservationsPageComponent {
  protected readonly facade = inject(ReservationsPageFacade);
}
