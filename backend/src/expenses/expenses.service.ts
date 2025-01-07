import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Expense } from "../entities/expense.entity";
import { Trip } from "../entities/trip.entity";
import { User } from "../entities/user.entity";

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private expensesRepository: Repository<Expense>,
    @InjectRepository(Trip)
    private tripsRepository: Repository<Trip>
  ) {}

  async create(
    tripId: string,
    data: Partial<Expense>,
    user: User
  ): Promise<Expense> {
    const trip = await this.tripsRepository.findOne({
      where: { id: tripId },
      relations: ["members"],
    });

    if (!trip) {
      throw new NotFoundException("Trip not found");
    }

    const expense = this.expensesRepository.create({
      ...data,
      amount: Number(data.amount),
      trip,
      user,
    });

    return this.expensesRepository.save(expense);
  }

  async remove(id: string, userId: string): Promise<void> {
    const expense = await this.expensesRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!expense) {
      throw new NotFoundException("Expense not found");
    }

    await this.expensesRepository.remove(expense);
  }
}
