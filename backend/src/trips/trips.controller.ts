import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Logger,
  Delete,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { TripsService } from "./trips.service";
import { TripStatus } from "../entities/trip.entity";

@UseGuards(JwtAuthGuard)
@Controller("trips")
export class TripsController {
  private readonly logger = new Logger(TripsController.name);

  constructor(private tripsService: TripsService) {}

  @Post()
  async create(@Request() req, @Body() createTripDto: any) {
    this.logger.log(`Creating trip for user ${req.user.id}`);
    return this.tripsService.create(createTripDto, req.user);
  }

  @Get()
  async findAll(@Request() req) {
    this.logger.log(`Fetching all trips for user ${req.user.id}`);
    return this.tripsService.findAll(req.user.id);
  }

  @Get(":id")
  async findOne(@Request() req, @Param("id") id: string) {
    this.logger.log(`Fetching trip ${id} for user ${req.user.id}`);
    const trip = await this.tripsService.findOne(id, req.user.id);
    this.logger.debug(`Found trip with ${trip.members.length} members`);
    return trip;
  }

  @Post(":id/members")
  async addMember(
    @Param("id") tripId: string,
    @Body() data: { email: string },
    @Request() req
  ) {
    this.logger.log(`Adding member ${data.email} to trip ${tripId}`);
    return this.tripsService.addMember(tripId, data.email, req.user.id);
  }

  @Delete(":id/members/:memberId")
  async removeMember(
    @Param("id") tripId: string,
    @Param("memberId") memberId: string,
    @Request() req
  ) {
    this.logger.log(`Removing member ${memberId} from trip ${tripId}`);
    return this.tripsService.removeMember(tripId, memberId, req.user.id);
  }

  @Post(":id/status")
  async updateStatus(
    @Param("id") tripId: string,
    @Body() data: { status: TripStatus },
    @Request() req
  ) {
    this.logger.log(`Updating trip ${tripId} status to ${data.status}`);
    return this.tripsService.updateTripStatus(tripId, req.user.id, data.status);
  }
}
