export type ReservationStatus =
  | 'pendiente'
  | 'confirmada'
  | 'completada'
  | 'cancelada'
  | 'bloqueada';

export interface Reservation {
  id: string;
  courtId: string;
  courtName: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  players: string[];
  contactName: string;
  contactEmail: string;
  notes?: string;
  totalPrice: number;
  deposit: number;
  depositPaid: boolean;
  status: ReservationStatus;
  remindersSent: boolean;
  createdAt: string;
  updatedAt?: string;
  fixedTurn?: boolean;
}
