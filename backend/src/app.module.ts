import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { TripsModule } from "./trips/trips.module";
import { ExpensesModule } from "./expenses/expenses.module";
import { User } from "./entities/user.entity";
import { Trip } from "./entities/trip.entity";
import { Expense } from "./entities/expense.entity";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT) || 5554,
      username: process.env.DB_USERNAME || "tripuser",
      password: process.env.DB_PASSWORD || "trippass",
      database: process.env.DB_NAME || "tripmanager",
      entities: [User, Trip, Expense],
      synchronize: true, // Set to false in production
    }),
    AuthModule,
    UsersModule,
    TripsModule,
    ExpensesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
