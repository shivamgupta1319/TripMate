import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinTable,
} from "typeorm";
import { User } from "./user.entity";
import { Expense } from "./expense.entity";

export enum TripStatus {
  ACTIVE = "active",
  COMPLETED = "completed",
}

@Entity()
export class Trip {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  destination: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({
    type: "enum",
    enum: TripStatus,
    default: TripStatus.ACTIVE,
  })
  status: TripStatus;

  @ManyToOne(() => User, (user) => user.createdTrips)
  creator: User;

  @ManyToMany(() => User)
  @JoinTable()
  members: User[];

  @OneToMany(() => Expense, (expense) => expense.trip)
  expenses: Expense[];
}
