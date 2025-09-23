import { Court } from '../../../shared/models/court';
import {
  Reservation,
  ReservationStatus,
} from '../../../shared/models/reservation';

export type CalendarViewMode = 'month' | 'week' | 'day';

export interface AvailabilitySlot {
  startTime: string;
  endTime: string;
  status: 'available' | 'reserved' | 'deposit' | 'blocked';
  reservation?: Reservation;
}

export interface CourtAvailability {
  court: Court;
  slots: AvailabilitySlot[];
}

export interface WeekDayOverview {
  date: Date;
  label: string;
  reservations: Reservation[];
}

export interface ConflictWarning {
  courtName: string;
  date: string;
  reservations: [Reservation, Reservation];
}

export interface ReminderItem {
  reservation: Reservation;
  daysToGo: number;
}

export interface ReservationSummary {
  isValid: boolean;
  total: number;
  deposit: number;
  depositPercentage: number;
  endTime?: string;
  courtName?: string;
  courtDescription?: string;
  players: string[];
}

export interface FilterFormValue {
  viewMode: CalendarViewMode;
  courtId: string;
  duration: number | null;
  status: 'all' | ReservationStatus;
  range: { start: Date | null; end: Date | null } | null;
  search: string | null;
}
