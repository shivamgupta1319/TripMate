import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ExpensesController } from "./expenses.controller";
import { ExpensesService } from "./expenses.service";
import { Expense } from "../entities/expense.entity";
import { Trip } from "../entities/trip.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Expense, Trip])],
  controllers: [ExpensesController],
  providers: [ExpensesService],
})
export class ExpensesModule {}
