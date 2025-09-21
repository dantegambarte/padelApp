import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Court } from '../../../shared/models/court';
import {
  Reservation,
  ReservationStatus,
} from '../../../shared/models/reservation';

export interface BlockSlotPayload {
  courtId: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  reason?: string;
}

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private readonly _courts = new BehaviorSubject<Court[]>([
    {
      id: 'c1',
      name: 'Cancha 1',
      description: 'Exterior - Césped sintético profesional',
      pricePerHour: 16000,
      indoor: false,
      hasLights: true,
    },
    {
      id: 'c2',
      name: 'Cancha 2',
      description: 'Interior - Blindex y superficie rápida',
      pricePerHour: 18500,
      indoor: true,
      hasLights: true,
    },
    {
      id: 'c3',
      name: 'Cancha 3',
      description: 'Exterior - Ideal para torneos nocturnos',
      pricePerHour: 15000,
      indoor: false,
      hasLights: true,
    },
  ]);

  private readonly _depositPercentage = new BehaviorSubject<number>(0.3);

  private readonly _depositPolicy = new BehaviorSubject<string>(
    'La seña equivale al 30% del valor del turno. Si cancelás con más de 24 horas de anticipación, se reintegra el 100%. Pasado ese plazo, la seña se pierde.'
  );

  private readonly _autoReminders = new BehaviorSubject<boolean>(true);

  private readonly _reservas = new BehaviorSubject<Reservation[]>([
    {
      id: 'r1',
      courtId: 'c1',
      courtName: 'Cancha 1',
      date: '2025-05-05',
      startTime: '18:00',
      endTime: '19:30',
      durationMinutes: 90,
      players: ['Dante Torres', 'Juan Pérez', 'Leo Gómez', 'Mati Ruiz'],
      contactName: 'Dante Torres',
      contactEmail: 'dante@example.com',
      notes: 'Traigo invitados',
      totalPrice: 24000,
      deposit: 7200,
      depositPaid: true,
      status: 'confirmada',
      remindersSent: false,
      createdAt: '2025-04-28T10:00:00.000Z',
    },
    {
      id: 'r2',
      courtId: 'c2',
      courtName: 'Cancha 2',
      date: '2025-05-05',
      startTime: '20:00',
      endTime: '21:00',
      durationMinutes: 60,
      players: ['Laura Medina', 'Sol Aguirre', 'Vicky López', 'Pao Díaz'],
      contactName: 'Laura Medina',
      contactEmail: 'laura@example.com',
      totalPrice: 18500,
      deposit: 5550,
      depositPaid: false,
      status: 'pendiente',
      remindersSent: false,
      createdAt: '2025-04-27T18:30:00.000Z',
      notes: 'Seña pendiente hasta mañana',
    },
    {
      id: 'r3',
      courtId: 'c2',
      courtName: 'Cancha 2',
      date: '2025-05-04',
      startTime: '09:00',
      endTime: '10:30',
      durationMinutes: 90,
      players: ['Club Torneos'],
      contactName: 'Coordinación Liga',
      contactEmail: 'liga@example.com',
      totalPrice: 27750,
      deposit: 8325,
      depositPaid: true,
      status: 'completada',
      remindersSent: true,
      createdAt: '2025-04-20T09:00:00.000Z',
      updatedAt: '2025-05-04T13:30:00.000Z',
    },
    {
      id: 'r4',
      courtId: 'c3',
      courtName: 'Cancha 3',
      date: '2025-05-06',
      startTime: '12:00',
      endTime: '14:00',
      durationMinutes: 120,
      players: [],
      contactName: 'Administración',
      contactEmail: 'info@clubpadel.com',
      totalPrice: 0,
      deposit: 0,
      depositPaid: true,
      status: 'bloqueada',
      remindersSent: false,
      createdAt: '2025-04-25T08:00:00.000Z',
      notes: 'Mantenimiento de la cancha',
    },
  ]);

  readonly reservas$: Observable<Reservation[]> = this._reservas.asObservable();
  readonly courts$: Observable<Court[]> = this._courts.asObservable();
  readonly depositPercentage$: Observable<number> =
    this._depositPercentage.asObservable();
  readonly depositPolicy$: Observable<string> =
    this._depositPolicy.asObservable();
  readonly autoReminders$: Observable<boolean> =
    this._autoReminders.asObservable();

  get depositPercentage(): number {
    return this._depositPercentage.value;
  }

  getCourtById(id: string): Court | undefined {
    return this._courts.value.find((court) => court.id === id);
  }

  calculatePrice(courtId: string, durationMinutes: number): number {
    const court = this.getCourtById(courtId);
    if (!court) return 0;
    return Math.round(((durationMinutes || 0) / 60) * court.pricePerHour);
  }

  calculateDeposit(totalPrice: number): number {
    return Math.round(totalPrice * this._depositPercentage.value);
  }

  addReservation(reservation: Reservation): Observable<void> {
    this._reservas.next([...this._reservas.value, reservation]);
    return of(void 0);
  }

  private updateReservation(
    id: string,
    changes: Partial<Reservation>
  ): Observable<void> {
    this._reservas.next(
      this._reservas.value.map((reserva) =>
        reserva.id === id
          ? { ...reserva, ...changes, updatedAt: new Date().toISOString() }
          : reserva
      )
    );
    return of(void 0);
  }

  cancelReservation(id: string): Observable<void> {
    this._reservas.next(
      this._reservas.value.map((x) =>
        x.id === id
          ? { ...x, status: 'cancelada', updatedAt: new Date().toISOString() }
          : x
      )
    );
    return of(void 0);
  }

  remove(id: string): Observable<void> {
    this._reservas.next(
      this._reservas.value.filter((reserva) => reserva.id !== id)
    );
    return of(void 0);
  }

  markDepositPaid(id: string): Observable<void> {
    return this.updateReservation(id, {
      depositPaid: true,
      status: 'confirmada',
    });
  }

  markCompleted(id: string): Observable<void> {
    return this.updateReservation(id, { status: 'completada' });
  }

  toggleReminder(id: string, remindersSent: boolean): Observable<void> {
    return this.updateReservation(id, { remindersSent });
  }

  blockSlot(payload: BlockSlotPayload): Observable<void> {
    const court = this.getCourtById(payload.courtId);
    if (!court) return of(void 0);

    const reservation: Reservation = {
      id: this.createId(),
      courtId: payload.courtId,
      courtName: court.name,
      date: payload.date,
      startTime: payload.startTime,
      endTime: payload.endTime,
      durationMinutes: payload.durationMinutes,
      players: [],
      contactName: 'Administración',
      contactEmail: 'info@clubpadel.com',
      notes: payload.reason,
      totalPrice: 0,
      deposit: 0,
      depositPaid: true,
      status: 'bloqueada',
      remindersSent: false,
      createdAt: new Date().toISOString(),
    };
    this._reservas.next([...this._reservas.value, reservation]);
    return of(void 0);
  }

  updateDepositPercentage(percentage: number): Observable<void> {
    this._depositPercentage.next(percentage);
    return of(void 0);
  }

  updateDepositPolicy(policy: string): Observable<void> {
    this._depositPolicy.next(policy);
    return of(void 0);
  }

  updateAutoReminders(enabled: boolean): Observable<void> {
    this._autoReminders.next(enabled);
    return of(void 0);
  }

  setReservationStatus(
    id: string,
    status: ReservationStatus
  ): Observable<void> {
    return this.updateReservation(id, { status });
  }

  private createId(): string {
    const randomUUID = globalThis.crypto?.randomUUID?.();
    if (randomUUID) return randomUUID;
    return `res_${Date.now()}_${Math.floor(Math.random() * 10_000)}`;
  }
}
