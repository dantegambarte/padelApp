import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Court } from '../../../shared/models/court';
import {
  Reservation,
  ReservationStatus,
} from '../../../shared/models/reservation';

export interface BlockSlotPayload {
  courtId: string;
  startDate: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  reason?: string;
  repeatWeekly?: boolean;
  repeatWeeks?: number;
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

  readonly fixedTurnWeeks = 12;

  private readonly _reservas = new BehaviorSubject<Reservation[]>([
    {
      id: 'r1',
      courtId: 'c1',
      courtName: 'Cancha 1',
      date: '2025-09-22',
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
      createdAt: '2025-09-15T10:00:00.000Z',
    },
    {
      id: 'r2',
      courtId: 'c2',
      courtName: 'Cancha 2',
      date: '2025-09-22',
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
      createdAt: '2025-09-13T18:30:00.000Z',
      notes: 'Seña pendiente hasta mañana',
    },
    {
      id: 'r3',
      courtId: 'c2',
      courtName: 'Cancha 2',
      date: '2025-09-18',
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
      createdAt: '2025-09-05T09:00:00.000Z',
      updatedAt: '2025-09-18T13:30:00.000Z',
    },
    {
      id: 'r4',
      courtId: 'c3',
      courtName: 'Cancha 3',
      date: '2025-09-24',
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
      createdAt: '2025-09-10T08:00:00.000Z',
      notes: 'Mantenimiento de la cancha',
    },
    {
      id: 'r5',
      courtId: 'c3',
      courtName: 'Cancha 3',
      date: '2025-09-25',
      startTime: '19:00',
      endTime: '20:00',
      durationMinutes: 60,
      players: [
        'Marcelo Funes',
        'Diego Ramírez',
        'Sergio Peña',
        'Alan Farías',
      ],
      contactName: 'Marcelo Funes',
      contactEmail: 'marcelo@example.com',
      totalPrice: 15000,
      deposit: 4500,
      depositPaid: true,
      status: 'confirmada',
      remindersSent: true,
      createdAt: '2025-09-10T16:20:00.000Z',
      notes: 'Pagan el resto al llegar',
    },
    {
      id: 'r6',
      courtId: 'c1',
      courtName: 'Cancha 1',
      date: '2025-09-26',
      startTime: '21:00',
      endTime: '22:30',
      durationMinutes: 90,
      players: ['Nicolás Juárez', 'Pedro Lamas', 'Raúl Ibáñez', 'Leo Núñez'],
      contactName: 'Nicolás Juárez',
      contactEmail: 'nico@example.com',
      totalPrice: 24000,
      deposit: 7200,
      depositPaid: false,
      status: 'pendiente',
      remindersSent: false,
      createdAt: '2025-09-19T19:45:00.000Z',
      notes: 'Confirman seña mañana',
    },
    {
      id: 'r7',
      courtId: 'c2',
      courtName: 'Cancha 2',
      date: '2025-09-28',
      startTime: '08:00',
      endTime: '10:00',
      durationMinutes: 120,
      players: [],
      contactName: 'Administración',
      contactEmail: 'info@clubpadel.com',
      totalPrice: 0,
      deposit: 0,
      depositPaid: true,
      status: 'bloqueada',
      remindersSent: false,
      createdAt: '2025-09-12T07:30:00.000Z',
      notes: 'Clínica con profesor invitado',
    },
    {
      id: 'r9',
      courtId: 'c1',
      courtName: 'Cancha 1',
      date: '2025-09-29',
      startTime: '08:00',
      endTime: '23:30',
      durationMinutes: 930,
      players: [],
      contactName: 'Administración',
      contactEmail: 'info@clubpadel.com',
      totalPrice: 0,
      deposit: 0,
      depositPaid: true,
      status: 'bloqueada',
      remindersSent: false,
      createdAt: '2025-09-14T09:00:00.000Z',
      notes: 'Cierre por torneo aniversario',
    },
    {
      id: 'r10',
      courtId: 'c2',
      courtName: 'Cancha 2',
      date: '2025-09-29',
      startTime: '08:00',
      endTime: '23:30',
      durationMinutes: 930,
      players: [],
      contactName: 'Administración',
      contactEmail: 'info@clubpadel.com',
      totalPrice: 0,
      deposit: 0,
      depositPaid: true,
      status: 'bloqueada',
      remindersSent: false,
      createdAt: '2025-09-14T09:05:00.000Z',
      notes: 'Torneo aniversario - Cancha techada',
    },
    {
      id: 'r11',
      courtId: 'c3',
      courtName: 'Cancha 3',
      date: '2025-09-29',
      startTime: '08:00',
      endTime: '23:30',
      durationMinutes: 930,
      players: [],
      contactName: 'Administración',
      contactEmail: 'info@clubpadel.com',
      totalPrice: 0,
      deposit: 0,
      depositPaid: true,
      status: 'bloqueada',
      remindersSent: false,
      createdAt: '2025-09-14T09:10:00.000Z',
      notes: 'Torneo aniversario - Predio completo',
    },
    {
      id: 'r8',
      courtId: 'c1',
      courtName: 'Cancha 1',
      date: '2025-09-30',
      startTime: '07:00',
      endTime: '08:00',
      durationMinutes: 60,
      players: ['Empresa FlexWork'],
      contactName: 'RRHH FlexWork',
      contactEmail: 'rrhh@flexwork.com',
      totalPrice: 16000,
      deposit: 4800,
      depositPaid: true,
      status: 'confirmada',
      remindersSent: false,
      createdAt: '2025-09-01T08:15:00.000Z',
      notes: 'Turno corporativo semanal',
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
    if (!court) {
      return of(void 0);
    }

    const repeatWeeks = payload.repeatWeekly
      ? payload.repeatWeeks ?? this.fixedTurnWeeks
      : 1;
    const baseDate = this.parseISODate(payload.startDate);
    const existing = [...this._reservas.value];
    const newReservations: Reservation[] = [];

    for (let index = 0; index < repeatWeeks; index++) {
      const currentDate = this.addDays(baseDate, index * 7);
      const dateKey = this.formatISODate(currentDate);
      const hasConflict = [...existing, ...newReservations].some(
        (reservation) =>
          reservation.courtId === payload.courtId &&
          reservation.date === dateKey &&
          reservation.status !== 'cancelada' &&
          this.isTimeOverlap(
            reservation.startTime,
            reservation.endTime,
            payload.startTime,
            payload.endTime
          )
      );

      if (hasConflict) {
        continue;
      }

      newReservations.push({
        id: this.createId(),
        courtId: payload.courtId,
        courtName: court.name,
        date: dateKey,
        startTime: payload.startTime,
        endTime: payload.endTime,
        durationMinutes: payload.durationMinutes,
        players: [],
        contactName: 'Administración',
        contactEmail: 'info@clubpadel.com',
        notes:
          payload.reason ??
          (payload.repeatWeekly ? 'Bloqueo de turno fijo' : undefined),
        totalPrice: 0,
        deposit: 0,
        depositPaid: true,
        status: 'bloqueada',
        remindersSent: false,
        createdAt: new Date().toISOString(),
        fixedTurn: payload.repeatWeekly ?? false,
      });
    }

    if (!newReservations.length) {
      return of(void 0);
    }

    this._reservas.next([...existing, ...newReservations]);
    return of(void 0);
  }

  private addDays(date: Date, days: number): Date {
    const next = new Date(date);
    next.setDate(date.getDate() + days);
    next.setHours(0, 0, 0, 0);
    return next;
  }

  private parseISODate(value: string): Date {
    const [year, month, day] = value.split('-').map((item) => Number(item));
    return new Date(year, (month ?? 1) - 1, day ?? 1);
  }

  private formatISODate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private isTimeOverlap(
    startA: string,
    endA: string,
    startB: string,
    endB: string
  ): boolean {
    const startMinutesA = this.parseTime(startA);
    const endMinutesA = this.parseTime(endA);
    const startMinutesB = this.parseTime(startB);
    const endMinutesB = this.parseTime(endB);
    return startMinutesA < endMinutesB && startMinutesB < endMinutesA;
  }

  private parseTime(time: string): number {
    const [hours, minutes] = time.split(':').map((value) => Number(value));
    return hours * 60 + minutes;
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
