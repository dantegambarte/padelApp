export type ReservationStatus = 'pendiente' | 'confirmada' | 'cancelada';

export interface Reservation {
  id: string;
  courtId: string;
  courtName: string;
  date: string;
  startTime: string;
  endTime: string;
  players: string[];
  deposit: number;
  status: ReservationStatus;
}
