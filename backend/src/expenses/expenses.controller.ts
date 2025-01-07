import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ExpensesService } from "./expenses.service";

@Controller("trips/:tripId/expenses")
@UseGuards(JwtAuthGuard)
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}

  @Post()
  create(
    @Request() req,
    @Param("tripId") tripId: string,
    @Body() createExpenseDto: any
  ) {
    return this.expensesService.create(tripId, createExpenseDto, req.user);
  }

  @Delete(":id")
  remove(@Request() req, @Param("id") id: string) {
    return this.expensesService.remove(id, req.user.id);
  }
}
