import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'reservas',
    pathMatch: 'full',
  },
  {
    path: 'reservas',
    loadComponent: () =>
      import(
        './features/reservations/pages/reservations-page/reservations-page.component'
      ).then((m) => m.ReservationsPageComponent),
  },
  {
    path: '**',
    redirectTo: 'reservas',
  },
];
