import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "./user.entity";
import { Trip } from "./trip.entity";

@Entity()
export class Expense {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  description: string;

  @Column("decimal", {
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  amount: number;

  @Column()
  date: Date;

  @ManyToOne(() => User, (user) => user.expenses)
  user: User;

  @ManyToOne(() => Trip, (trip) => trip.expenses)
  trip: Trip;
}
