import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Trip } from "./trip.entity";
import { Expense } from "./expense.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @OneToMany(() => Trip, (trip) => trip.creator)
  createdTrips: Trip[];

  @OneToMany(() => Expense, (expense) => expense.user)
  expenses: Expense[];
}
