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
import { Component, DestroyRef, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  shareReplay,
  startWith,
  forkJoin,
} from 'rxjs';
import {
  Reservation,
  ReservationStatus,
} from '../../../../shared/models/reservation';
import { ReservationService } from '../../services/reservation.service';
import { Court } from '../../../../shared/models/court';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import {
  MatCalendarCellClassFunction,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AvailabilitySlot,
  CalendarViewMode,
  ConflictWarning,
  CourtAvailability,
  FilterFormValue,
  ReminderItem,
  ReservationSummary,
  WeekDayOverview,
} from '../../models/reservations-page.models';

@Component({
  selector: 'app-reservations-page',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgClass,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    AsyncPipe,
    DatePipe,
    CurrencyPipe,
    DecimalPipe,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatCardModule,
    MatListModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatBadgeModule,
    MatExpansionModule,
    MatSnackBarModule,
  ],
  templateUrl: './reservations-page.component.html',
  styleUrls: ['./reservations-page.component.scss'],
})
export class ReservationsPageComponent {
  private readonly reservationService = inject(ReservationService);
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  readonly today = this.getStartOfDay(new Date());
  readonly roleControl = new FormControl<'player' | 'admin'>('admin', {
    nonNullable: true,
  });

  readonly viewModes: { label: string; value: CalendarViewMode }[] = [
    { label: 'Día', value: 'day' },
    { label: 'Semana', value: 'week' },
    { label: 'Mes', value: 'month' },
  ];

  readonly durationOptions = [
    { label: '30 minutos', value: 30 },
    { label: '1 hora', value: 60 },
    { label: '1 h 30 min', value: 90 },
    { label: '2 horas', value: 120 },
  ];

  readonly statusFilters: {
    label: string;
    value: 'all' | ReservationStatus;
  }[] = [
    { label: 'Todos', value: 'all' },
    { label: 'Pendientes', value: 'pendiente' },
    { label: 'Confirmadas', value: 'confirmada' },
    { label: 'Completadas', value: 'completada' },
    { label: 'Canceladas', value: 'cancelada' },
    { label: 'Bloqueos', value: 'bloqueada' },
  ];

  readonly timeOptions = this.generateTimeOptions();

  readonly filterForm = this.fb.group({
    viewMode: this.fb.control<CalendarViewMode>('week', { nonNullable: true }),
    courtId: this.fb.control<string>('all', { nonNullable: true }),
    duration: this.fb.control<number | null>(60),
    status: this.fb.control<'all' | ReservationStatus>('all', {
      nonNullable: true,
    }),
    range: this.fb.group({
      start: [this.today],
      end: [this.today],
    }),
    search: this.fb.control<string>(''),
  });

  readonly reservationForm = this.fb.group({
    courtId: ['', Validators.required],
    date: [this.today, Validators.required],
    startTime: [this.timeOptions[20], Validators.required],
    duration: [60, Validators.required],
    contactName: ['', Validators.required],
    contactEmail: ['', [Validators.required, Validators.email]],
    players: ['', Validators.required],
    notes: [''],
    payDeposit: [true],
  });

  readonly policyForm = this.fb.group({
    depositPercentage: [
      30,
      [Validators.required, Validators.min(0), Validators.max(100)],
    ],
    policyText: ['', [Validators.required, Validators.minLength(10)]],
    autoReminders: [true],
  });

  readonly blockForm = this.fb.group({
    courtId: ['', Validators.required],
    date: [this.today, Validators.required],
    startTime: [this.timeOptions[0], Validators.required],
    duration: [60, Validators.required],
    reason: [''],
  });

  readonly reservas$: Observable<Reservation[]> = this.reservationService.reservas$;
  readonly courts$: Observable<Court[]> = this.reservationService.courts$;
  readonly depositPercentage$: Observable<number> = this.reservationService.depositPercentage$;
  readonly depositPolicy$: Observable<string> = this.reservationService.depositPolicy$;
  readonly autoReminders$: Observable<boolean> = this.reservationService.autoReminders$;

  readonly playerColumns = [
    'date',
    'court',
    'time',
    'status',
    'deposit',
    'actions',
  ];
  readonly historyColumns = ['date', 'court', 'time', 'status', 'deposit'];
  readonly adminColumns = [
    'court',
    'date',
    'time',
    'contact',
    'deposit',
    'status',
    'actions',
  ];

  readonly calendarLegend = [
    { label: 'Disponible', class: 'available' },
    { label: 'Reservada', class: 'reserved' },
    { label: 'Seña pagada', class: 'deposit' },
    { label: 'Bloqueada', class: 'blocked' },
  ];

  private readonly currentUser = {
    name: 'Dante Torres',
    email: 'dante@example.com',
  };

  private reservationsSnapshot: Reservation[] = [];

  private readonly selectedDateSubject = new BehaviorSubject<Date>(this.today);
  readonly selectedDate$ = this.selectedDateSubject.asObservable();

  readonly isAdmin$ = this.roleControl.valueChanges.pipe(
    startWith(this.roleControl.value),
    map((role) => role === 'admin'),
    shareReplay(1)
  );

  private readonly filterValue$ = this.filterForm.valueChanges.pipe(
    startWith(this.filterForm.getRawValue()),
    map(() => this.filterForm.getRawValue() as FilterFormValue)
  );

  readonly filteredReservations$ = combineLatest([
    this.reservas$,
    this.filterValue$,
    this.roleControl.valueChanges.pipe(startWith(this.roleControl.value)),
  ]).pipe(
    map(([reservations, filters, role]) =>
      this.applyFilters(reservations, filters, role)
    ),
    shareReplay(1)
  );

  readonly myUpcomingReservations$ = this.reservas$.pipe(
    map((reservations) =>
      reservations
        .filter(
          (reservation) =>
            this.belongsToCurrentUser(reservation) &&
            !this.isPastReservation(reservation) &&
            reservation.status !== 'cancelada'
        )
        .sort((a, b) => this.compareReservations(a, b))
    )
  );

  readonly myHistoryReservations$ = this.reservas$.pipe(
    map((reservations) =>
      reservations
        .filter(
          (reservation) =>
            this.belongsToCurrentUser(reservation) &&
            (this.isPastReservation(reservation) ||
              reservation.status === 'cancelada')
        )
        .sort((a, b) => this.compareReservations(b, a))
    )
  );

  readonly adminReservations$ = combineLatest([
    this.filteredReservations$,
    this.isAdmin$,
  ]).pipe(
    map(([reservations, isAdmin]) =>
      isAdmin
        ? reservations
        : reservations.filter((r) => this.belongsToCurrentUser(r))
    )
  );

  readonly conflictWarnings$ = this.reservas$.pipe(
    map((reservations) => this.findConflicts(reservations))
  );

  readonly reminders$ = combineLatest([
    this.reservas$,
    this.autoReminders$,
  ]).pipe(
    map(([reservations, autoReminders]) =>
      autoReminders ? this.buildReminderItems(reservations) : []
    )
  );

  readonly weekOverview$ = combineLatest([
    this.reservas$,
    this.courts$,
    this.selectedDate$,
  ]).pipe(
    map(([reservations, courts, date]) =>
      this.buildWeekOverview(reservations, courts, date)
    )
  );

  readonly dayAvailability$ = combineLatest([
    this.reservas$,
    this.courts$,
    this.selectedDate$,
    this.filterForm.controls.duration.valueChanges.pipe(
      startWith(this.filterForm.controls.duration.value ?? 60)
    ),
    this.filterForm.controls.courtId.valueChanges.pipe(
      startWith(this.filterForm.controls.courtId.value ?? 'all')
    ),
  ]).pipe(
    map(([reservations, courts, date, duration, courtId]) =>
      this.buildDayAvailability(
        reservations,
        courts,
        date,
        duration ?? 60,
        courtId
      )
    )
  );

  readonly reservationSummary$ = combineLatest([
    this.reservationForm.valueChanges.pipe(
      startWith(this.reservationForm.getRawValue())
    ),
    this.depositPercentage$,
    this.courts$,
  ]).pipe(
    map(([formValue, depositPercentage, courts]) =>
      this.buildReservationSummary(formValue, depositPercentage, courts)
    )
  );

  readonly selectedDateLabel$ = combineLatest([
    this.selectedDate$,
    this.filterForm.controls.viewMode.valueChanges.pipe(
      startWith(this.filterForm.controls.viewMode.value)
    ),
  ]).pipe(map(([date, mode]) => this.getSelectedDateLabel(date, mode)));

  readonly selectedDateReservations$ = combineLatest([
    this.reservas$,
    this.selectedDate$,
  ]).pipe(
    map(([reservations, date]) => {
      const dateKey = this.toISODate(date);
      return reservations
        .filter((reservation) => reservation.date === dateKey)
        .sort((a, b) => this.compareReservations(a, b));
    })
  );

  readonly monthSummary$ = combineLatest([
    this.reservas$,
    this.selectedDate$,
  ]).pipe(
    map(([reservations, date]) => {
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const summary = new Map<string, number>();
      reservations.forEach((reservation) => {
        const [resYear, resMonth] = reservation.date
          .split('-')
          .map((value) => Number(value));
        if (resYear === year && resMonth === month) {
          summary.set(
            reservation.date,
            (summary.get(reservation.date) ?? 0) + 1
          );
        }
      });
      return Array.from(summary.entries())
        .map(([dateKey, count]) => ({
          date: dateKey,
          count,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
    })
  );

  readonly trackById = (_: number, reservation: Reservation) => reservation.id;

  readonly calendarDateClass: MatCalendarCellClassFunction<Date> = (
    cellDate,
    view
  ) => {
    if (view !== 'month') {
      return '';
    }
    const dateKey = this.toISODate(cellDate);
    const reservations = this.reservationsSnapshot.filter(
      (reservation) =>
        reservation.date === dateKey && reservation.status !== 'cancelada'
    );
    if (!reservations.length) {
      return '';
    }
    if (
      reservations.some((reservation) => reservation.status === 'bloqueada')
    ) {
      return 'blocked';
    }
    if (reservations.some((reservation) => reservation.depositPaid)) {
      return 'deposit';
    }
    return 'reserved';
  };

  readonly statusLabels: Record<ReservationStatus, string> = {
    pendiente: 'Pendiente de seña',
    confirmada: 'Confirmada',
    completada: 'Completada',
    cancelada: 'Cancelada',
    bloqueada: 'Bloqueada por el club',
  };

  getStatusLabel(status: ReservationStatus): string {
    return this.statusLabels[status];
  }

  constructor() {
    this.reservas$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((reservations) => (this.reservationsSnapshot = reservations));

    combineLatest([
      this.depositPolicy$,
      this.depositPercentage$,
      this.autoReminders$,
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([policy, percentage, autoReminders]) => {
        this.policyForm.patchValue(
          {
            policyText: policy,
            depositPercentage: Math.round(percentage * 100),
            autoReminders,
          },
          { emitEvent: false }
        );
      });
  }

  onChangeRole(role: 'player' | 'admin') {
    this.roleControl.setValue(role, { emitEvent: true });
  }

  changeView(mode: CalendarViewMode) {
    this.filterForm.controls.viewMode.setValue(mode);
  }

  navigate(direction: 'prev' | 'next') {
    const mode = this.filterForm.controls.viewMode.value;
    const currentDate = this.selectedDateSubject.value;
    const newDate = new Date(currentDate);
    switch (mode) {
      case 'day':
        newDate.setDate(
          currentDate.getDate() + (direction === 'next' ? 1 : -1)
        );
        break;
      case 'week':
        newDate.setDate(
          currentDate.getDate() + (direction === 'next' ? 7 : -7)
        );
        break;
      case 'month':
        newDate.setMonth(
          currentDate.getMonth() + (direction === 'next' ? 1 : -1)
        );
        break;
    }
    this.onDateSelected(newDate);
  }

  onDateSelected(date: Date | null) {
    if (!date) {
      return;
    }
    const normalized = this.getStartOfDay(date);
    this.selectedDateSubject.next(normalized);
    this.filterForm.controls.range.patchValue({
      start: normalized,
      end: normalized,
    });
    this.reservationForm.controls.date.setValue(normalized);
    this.blockForm.controls.date.setValue(normalized);
  }

  selectSlot(slot: AvailabilitySlot, court: Court, date: Date) {
    if (slot.status !== 'available') {
      if (slot.reservation) {
        this.snackBar.open(
          `Turno ocupado: ${slot.reservation.contactName} - ${
            this.statusLabels[slot.reservation.status]
          }`,
          'Cerrar',
          { duration: 3500 }
        );
      }
      return;
    }
    this.reservationForm.patchValue({
      courtId: court.id,
      date,
      startTime: slot.startTime,
      duration: this.filterForm.controls.duration.value ?? 60,
    });
    this.snackBar.open(
      `Turno seleccionado en ${court.name} a las ${slot.startTime}`,
      'Completar datos',
      { duration: 3500 }
    );
  }

  submitReservation() {
    if (this.reservationForm.invalid) {
      this.reservationForm.markAllAsTouched();
      return;
    }

    const value = this.reservationForm.getRawValue();
    const court = this.reservationService.getCourtById(value.courtId ?? '');
    if (!court || !value.date || !value.startTime) {
      this.snackBar.open(
        'Por favor seleccioná una cancha, fecha y horario válidos.',
        'Cerrar',
        { duration: 4000 }
      );
      return;
    }

    const duration = value.duration ?? 60;
    const endTime = this.addMinutesToTime(value.startTime, duration);
    const players = value.players
      ? value.players
          .split(',')
          .map((player) => player.trim())
          .filter(Boolean)
      : [];

    const totalPrice = this.reservationService.calculatePrice(
      court.id,
      duration
    );
    const deposit = this.reservationService.calculateDeposit(totalPrice);

    const reservation: Reservation = {
      id: this.generateId(),
      courtId: court.id,
      courtName: court.name,
      date: this.toISODate(value.date),
      startTime: value.startTime,
      endTime,
      durationMinutes: duration,
      players,
      contactName: value.contactName!,
      contactEmail: value.contactEmail!,
      notes: value.notes ?? undefined,
      totalPrice,
      deposit,
      depositPaid: Boolean(value.payDeposit),
      status: value.payDeposit ? 'confirmada' : 'pendiente',
      remindersSent: false,
      createdAt: new Date().toISOString(),
    };

    this.reservationService.addReservation(reservation).subscribe(() => {
      this.snackBar.open(
        'Reserva creada. Recordá completar el pago restante.',
        'OK',
        { duration: 3500 }
      );
      this.reservationForm.patchValue({ players: '', notes: '' });
    });
  }

  cancel(reservation: Reservation) {
    const message =
      reservation.status === 'bloqueada'
        ? '¿Quitar el bloqueo de la cancha para este turno?'
        : '¿Cancelar la reserva seleccionada? Se aplicarán las políticas de cancelación.';
    if (!confirm(message)) return;

    if (reservation.status === 'bloqueada') {
      this.reservationService.remove(reservation.id).subscribe(() => {
        this.snackBar.open('Bloqueo eliminado', 'Cerrar', { duration: 3000 });
      });
      return;
    }
    this.reservationService.cancelReservation(reservation.id).subscribe(() => {
      this.snackBar.open('Reserva cancelada', 'Cerrar', { duration: 3000 });
    });
  }

  markDepositPaid(reservation: Reservation) {
    this.reservationService.markDepositPaid(reservation.id).subscribe(() => {
      this.snackBar.open('Se registró el pago de la seña.', 'Cerrar', {
        duration: 3000,
      });
    });
  }

  markCompleted(reservation: Reservation) {
    this.reservationService.markCompleted(reservation.id).subscribe(() => {
      this.snackBar.open('Turno marcado como completado.', 'Cerrar', {
        duration: 3000,
      });
    });
  }

  toggleReminder(reservation: Reservation) {
    this.reservationService
      .toggleReminder(reservation.id, !reservation.remindersSent)
      .subscribe(() => {
        const message = reservation.remindersSent
          ? 'Se desactivó el recordatorio automático.'
          : 'Recordatorio programado con éxito.';
        this.snackBar.open(message, 'Cerrar', { duration: 3000 });
      });
  }

  updatePolicies() {
    if (this.policyForm.invalid) {
      this.policyForm.markAllAsTouched();
      return;
    }
    const { depositPercentage, policyText, autoReminders } =
      this.policyForm.getRawValue();
    const percentage = Math.max(0, Math.min(100, depositPercentage ?? 0));

    // Para updates “fire-and-forget” en paralelo, usar forkJoin y que el service devuelva Observable<void>
    forkJoin([
      this.reservationService.updateDepositPercentage(percentage / 100),
      this.reservationService.updateDepositPolicy(policyText ?? ''),
      this.reservationService.updateAutoReminders(Boolean(autoReminders)),
    ]).subscribe(() => {
      this.snackBar.open('Políticas de seña actualizadas.', 'Cerrar', {
        duration: 3000,
      });
    });
  }

  blockSlot() {
    if (this.blockForm.invalid) {
      this.blockForm.markAllAsTouched();
      return;
    }
    const value = this.blockForm.getRawValue();
    const court = this.reservationService.getCourtById(value.courtId ?? '');
    if (!court || !value.date || !value.startTime) return;

    const duration = value.duration ?? 60;
    const endTime = this.addMinutesToTime(value.startTime, duration);

    this.reservationService
      .blockSlot({
        courtId: court.id,
        date: this.toISODate(value.date),
        startTime: value.startTime,
        endTime,
        durationMinutes: duration,
        reason: value.reason ?? undefined,
      })
      .subscribe(() => {
        this.snackBar.open('Se bloqueó el turno seleccionado.', 'Cerrar', {
          duration: 3000,
        });
      });
  }

  getDepositBadge(reservation: Reservation): 'pagada' | 'pendiente' {
    if (reservation.status === 'bloqueada') return 'pagada';
    return reservation.depositPaid ? 'pagada' : 'pendiente';
  }

  statusClass(reservation: Reservation): string {
    if (reservation.status === 'bloqueada') return 'blocked';
    if (reservation.status === 'cancelada') return 'cancelled';
    return reservation.depositPaid ? 'deposit' : 'reserved';
  }

  private buildReservationSummary(
    formValue: any,
    depositPercentage: number,
    courts: Court[]
  ): ReservationSummary {
    const { courtId, duration, startTime, players } = formValue;
    const court = courts.find((item) => item.id === courtId);
    if (!court || !duration || !startTime) {
      return {
        isValid: false,
        total: 0,
        deposit: 0,
        depositPercentage,
        players: [],
      };
    }
    const total = this.reservationService.calculatePrice(court.id, duration);
    const deposit = Math.round(total * depositPercentage);
    const playerList = players
      ? players
          .split(',')
          .map((player: string) => player.trim())
          .filter(Boolean)
      : [];
    return {
      isValid: true,
      total,
      deposit,
      depositPercentage,
      endTime: this.addMinutesToTime(startTime, duration),
      courtName: court.name,
      players: playerList,
    };
  }

  private buildDayAvailability(
    reservations: Reservation[],
    courts: Court[],
    date: Date,
    duration: number,
    courtId: string
  ): CourtAvailability[] {
    const dateKey = this.toISODate(date);
    const filteredCourts =
      courtId === 'all'
        ? courts
        : courts.filter((court) => court.id === courtId);
    return filteredCourts.map((court) => {
      const slots = this.generateSlotsForCourt(
        reservations,
        court,
        dateKey,
        duration
      );
      return { court, slots };
    });
  }

  private buildWeekOverview(
    reservations: Reservation[],
    courts: Court[],
    date: Date
  ): WeekDayOverview[] {
    const start = this.getStartOfWeek(date);
    const overview: WeekDayOverview[] = [];
    for (let index = 0; index < 7; index++) {
      const current = new Date(start);
      current.setDate(start.getDate() + index);
      const dateKey = this.toISODate(current);
      const dayReservations = reservations
        .filter((reservation) => reservation.date === dateKey)
        .filter((reservation) => reservation.status !== 'cancelada')
        .sort((a, b) => this.compareReservations(a, b));
      const label = this.formatDayLabel(current);
      overview.push({ date: current, label, reservations: dayReservations });
    }
    return overview;
  }

  private buildReminderItems(reservations: Reservation[]): ReminderItem[] {
    const now = new Date();
    return reservations
      .filter((reservation) => reservation.status !== 'cancelada')
      .map((reservation) => {
        const reservationDate = this.combineDateAndTime(
          reservation.date,
          reservation.startTime
        );
        const diff = reservationDate.getTime() - now.getTime();
        const days = Math.ceil(diff / (24 * 60 * 60 * 1000));
        return { reservation, daysToGo: days };
      })
      .filter((item) => item.daysToGo >= 0 && item.daysToGo <= 3)
      .sort((a, b) => a.daysToGo - b.daysToGo);
  }

  private applyFilters(
    reservations: Reservation[],
    filters: FilterFormValue,
    role: 'player' | 'admin'
  ): Reservation[] {
    const range = filters.range ?? { start: null, end: null };
    const start = range.start ? this.toISODate(range.start) : null;
    const end = range.end ? this.toISODate(range.end) : null;
    const search = (filters.search ?? '').trim().toLowerCase();

    return reservations
      .filter((reservation) => {
        if (role === 'player' && !this.belongsToCurrentUser(reservation)) {
          return false;
        }
        if (
          filters.courtId !== 'all' &&
          reservation.courtId !== filters.courtId
        ) {
          return false;
        }
        if (filters.status !== 'all' && reservation.status !== filters.status) {
          return false;
        }
        if (
          filters.duration &&
          reservation.durationMinutes !== filters.duration
        ) {
          return false;
        }
        if (start && reservation.date < start) return false;
        if (end && reservation.date > end) return false;

        if (search) {
          const haystack = [
            reservation.contactName,
            reservation.contactEmail,
            reservation.players.join(', '),
            reservation.courtName,
            reservation.status,
          ]
            .join(' ')
            .toLowerCase();
          return haystack.includes(search);
        }
        return true;
      })
      .sort((a, b) => this.compareReservations(a, b));
  }

  private belongsToCurrentUser(reservation: Reservation): boolean {
    return (
      reservation.contactEmail.toLowerCase() ===
        this.currentUser.email.toLowerCase() ||
      reservation.players.some(
        (player) =>
          this.normalize(player) === this.normalize(this.currentUser.name)
      )
    );
  }

  private findConflicts(reservations: Reservation[]): ConflictWarning[] {
    const warnings: ConflictWarning[] = [];
    const active = reservations.filter(
      (reservation) => reservation.status !== 'cancelada'
    );
    const sorted = active.sort((a, b) => this.compareReservations(a, b));
    for (let i = 0; i < sorted.length; i++) {
      for (let j = i + 1; j < sorted.length; j++) {
        const first = sorted[i];
        const second = sorted[j];
        if (first.courtId !== second.courtId || first.date !== second.date) {
          continue;
        }
        if (
          this.isTimeOverlap(
            first.startTime,
            first.endTime,
            second.startTime,
            second.endTime
          )
        ) {
          warnings.push({
            courtName: first.courtName,
            date: first.date,
            reservations: [first, second],
          });
        }
      }
    }
    return warnings;
  }

  private generateSlotsForCourt(
    reservations: Reservation[],
    court: Court,
    date: string,
    duration: number
  ): AvailabilitySlot[] {
    const sameDay = reservations.filter(
      (reservation) =>
        reservation.courtId === court.id &&
        reservation.date === date &&
        reservation.status !== 'cancelada'
    );
    const slots: AvailabilitySlot[] = [];
    const step = 30;
    const opening = 8 * 60;
    const closing = 24 * 60;
    const maxStart = closing - duration;
    for (let minutes = opening; minutes <= maxStart; minutes += step) {
      const startTime = this.minutesToTime(minutes);
      const endTime = this.minutesToTime(minutes + duration);
      const reservation = sameDay.find((item) =>
        this.isTimeOverlap(item.startTime, item.endTime, startTime, endTime)
      );
      if (!reservation) {
        slots.push({ startTime, endTime, status: 'available' });
        continue;
      }
      const status: AvailabilitySlot['status'] =
        reservation.status === 'bloqueada'
          ? 'blocked'
          : reservation.depositPaid
          ? 'deposit'
          : 'reserved';
      slots.push({ startTime, endTime, status, reservation });
    }
    return slots;
  }

  private generateTimeOptions(): string[] {
    const options: string[] = [];
    for (let hour = 7; hour <= 23; hour++) {
      options.push(`${hour.toString().padStart(2, '0')}:00`);
      options.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return options;
  }

  private compareReservations(a: Reservation, b: Reservation): number {
    if (a.date === b.date) {
      return this.parseTime(a.startTime) - this.parseTime(b.startTime);
    }
    return a.date.localeCompare(b.date);
  }

  private parseTime(time: string): number {
    const [hours, minutes] = time.split(':').map((value) => Number(value));
    return hours * 60 + minutes;
  }

  private minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${rest
      .toString()
      .padStart(2, '0')}`;
  }

  private addMinutesToTime(time: string, minutesToAdd: number): string {
    const base = this.parseTime(time);
    return this.minutesToTime(base + minutesToAdd);
  }

  private normalize(value: string): string {
    return value.trim().toLowerCase();
  }

  private combineDateAndTime(date: string, time: string): Date {
    return new Date(`${date}T${time}:00`);
  }

  private isPastReservation(reservation: Reservation): boolean {
    const reservationDate = this.combineDateAndTime(
      reservation.date,
      reservation.endTime
    );
    return reservationDate.getTime() < Date.now();
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

  private getStartOfDay(date: Date): Date {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  }

  private toISODate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private getStartOfWeek(date: Date): Date {
    const day = date.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(date);
    monday.setDate(date.getDate() + diff);
    return this.getStartOfDay(monday);
  }

  private formatDayLabel(date: Date): string {
    const formatter = new Intl.DateTimeFormat('es-AR', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
    return formatter.format(date);
  }

  private getSelectedDateLabel(date: Date, mode: CalendarViewMode): string {
    const formatter = new Intl.DateTimeFormat('es-AR', {
      month: 'long',
      day: 'numeric',
    });
    if (mode === 'day') {
      return formatter.format(date);
    }
    if (mode === 'week') {
      const start = this.getStartOfWeek(date);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      const endFormatter = new Intl.DateTimeFormat('es-AR', {
        month: 'long',
        day: 'numeric',
      });
      return `${formatter.format(start)} - ${endFormatter.format(end)}`;
    }
    const monthFormatter = new Intl.DateTimeFormat('es-AR', {
      month: 'long',
      year: 'numeric',
    });
    return monthFormatter.format(date);
  }

  private generateId(): string {
    const randomUUID = globalThis.crypto?.randomUUID?.();
    if (randomUUID) return randomUUID;
    return `res_${Date.now()}_${Math.floor(Math.random() * 10_000)}`;
  }
}
