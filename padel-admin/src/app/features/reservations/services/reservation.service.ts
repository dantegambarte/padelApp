import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Reservation } from '../../../shared/models/reservation';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private readonly _reservas = new BehaviorSubject<Reservation[]>([
    {
      id: 'r1',
      courtId: 'c1',
      courtName: 'Cancha 1',
      date: '2025-09-22',
      startTime: '18:00',
      endTime: '19:00',
      players: ['Dante', 'Juan', 'Leo', 'Mati'],
      deposit: 4000,
      status: 'pendiente',
    },
  ]);

  reservas$: Observable<Reservation[]> = this._reservas.asObservable();

  add(reserva: Reservation) {
    this._reservas.next([...this._reservas.value, reserva]);
    return of(true);
  }

  remove(id: string) {
    this._reservas.next(this._reservas.value.filter((r) => r.id !== id));
    return of(true);
  }
}
