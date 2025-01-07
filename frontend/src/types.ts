export interface User {
  id: string;
  name: string;
  email: string;
}

export enum TripStatus {
  ACTIVE = "active",
  COMPLETED = "completed",
}

export interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: TripStatus;
  creator: User;
  members: User[];
  expenses: Expense[];
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  user: User;
  trip: Trip;
}
