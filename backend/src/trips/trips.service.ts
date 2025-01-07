import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Trip } from "../entities/trip.entity";
import { User } from "../entities/user.entity";
import { TripStatus } from "../entities/trip.entity";

@Injectable()
export class TripsService {
  private readonly logger = new Logger(TripsService.name);

  constructor(
    @InjectRepository(Trip)
    private tripsRepository: Repository<Trip>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create(data: Partial<Trip>, creator: User): Promise<Trip> {
    const trip = this.tripsRepository.create({
      ...data,
      creator,
      members: [creator],
    });
    return this.tripsRepository.save(trip);
  }

  async findAll(userId: string): Promise<Trip[]> {
    const trips = await this.tripsRepository
      .createQueryBuilder("trip")
      .leftJoinAndSelect("trip.members", "member")
      .leftJoinAndSelect("trip.creator", "creator")
      .leftJoinAndSelect("trip.expenses", "expense")
      .leftJoinAndSelect("expense.user", "expenseUser")
      .orderBy("trip.status", "DESC")
      .addOrderBy("trip.startDate", "DESC")
      .getMany();

    const userInTrips = trips.filter(({ members }) =>
      members.find((member) => member.id === userId)
    );

    return userInTrips;
  }

  async findOne(id: string, userId: string): Promise<Trip> {
    // First check if the user is a member of the trip
    const userIsMember = await this.tripsRepository
      .createQueryBuilder("trip")
      .leftJoin("trip.members", "member")
      .where("trip.id = :id", { id })
      .andWhere("member.id = :userId", { userId })
      .getExists();

    if (!userIsMember) {
      throw new UnauthorizedException("You are not a member of this trip");
    }

    // If user is a member, get all trip details including all members and expenses
    const trip = await this.tripsRepository
      .createQueryBuilder("trip")
      .leftJoinAndSelect("trip.members", "member")
      .leftJoinAndSelect("trip.creator", "creator")
      .leftJoinAndSelect("trip.expenses", "expense")
      .leftJoinAndSelect("expense.user", "expenseUser")
      .where("trip.id = :id", { id })
      .getOne();

    if (!trip) {
      throw new NotFoundException("Trip not found");
    }

    this.logger.debug(
      `Found trip with ${trip.members.length} members and ${trip.expenses.length} expenses`
    );
    return trip;
  }

  async addMember(tripId: string, email: string, userId: string) {
    this.logger.debug(`Adding member with email ${email} to trip ${tripId}`);

    const trip = await this.tripsRepository.findOne({
      where: { id: tripId },
      relations: ["members"],
    });

    if (!trip) {
      throw new NotFoundException("Trip not found");
    }

    if (!trip.members.some((member) => member.id === userId)) {
      throw new UnauthorizedException(
        "Not authorized to add members to this trip"
      );
    }

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (trip.members.some((member) => member.id === user.id)) {
      throw new BadRequestException("User is already a member of this trip");
    }

    trip.members.push(user);
    const updatedTrip = await this.tripsRepository.save(trip);
    this.logger.debug(
      `Successfully added member. New member count: ${updatedTrip.members.length}`
    );
    return updatedTrip;
  }

  async removeMember(tripId: string, memberId: string, userId: string) {
    this.logger.debug(`Removing member ${memberId} from trip ${tripId}`);

    const trip = await this.tripsRepository.findOne({
      where: { id: tripId },
      relations: ["members", "creator"],
    });

    if (!trip) {
      throw new NotFoundException("Trip not found");
    }

    // Only allow creator or the member themselves to remove
    if (trip.creator.id !== userId && userId !== memberId) {
      throw new UnauthorizedException(
        "Not authorized to remove this member from the trip"
      );
    }

    // Don't allow removing the creator
    if (memberId === trip.creator.id) {
      throw new BadRequestException("Cannot remove the trip creator");
    }

    trip.members = trip.members.filter((member) => member.id !== memberId);
    const updatedTrip = await this.tripsRepository.save(trip);
    this.logger.debug(
      `Successfully removed member. New member count: ${updatedTrip.members.length}`
    );
    return updatedTrip;
  }

  async updateTripStatus(
    tripId: string,
    userId: string,
    status: TripStatus
  ): Promise<Trip> {
    const trip = await this.tripsRepository.findOne({
      where: { id: tripId },
      relations: ["creator", "members"],
    });

    if (!trip) {
      throw new NotFoundException("Trip not found");
    }

    // Only creator can complete the trip
    if (trip.creator.id !== userId) {
      throw new UnauthorizedException(
        "Only trip creator can update trip status"
      );
    }

    trip.status = status;
    return this.tripsRepository.save(trip);
  }
}
