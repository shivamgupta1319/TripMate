import {
  Controller,
  Post,
  Get,
  Body,
  UnauthorizedException,
  UseGuards,
  Request,
  Logger,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersService } from "../users/users.service";
import { JwtAuthGuard } from "./jwt-auth.guard";

@Controller("auth")
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  @Post("login")
  async login(@Body() body: { email: string; password: string }) {
    this.logger.debug(`Login attempt for email: ${body.email}`);
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      this.logger.warn(`Failed login attempt for email: ${body.email}`);
      throw new UnauthorizedException("Invalid credentials");
    }
    this.logger.debug(`Successful login for email: ${body.email}`);
    return this.authService.login(user);
  }

  @Get("verify")
  @UseGuards(JwtAuthGuard)
  async verifyToken(@Request() req) {
    this.logger.debug(`Token verification request received`);
    this.logger.debug(`User from request: ${JSON.stringify(req.user)}`);

    if (!req.user) {
      this.logger.error("No user found in request after JWT validation");
      throw new UnauthorizedException("Invalid token");
    }

    return {
      verified: true,
      user: req.user,
      timestamp: new Date().toISOString(),
    };
  }

  @Post("register")
  async register(
    @Body() body: { name: string; email: string; password: string }
  ) {
    const existingUser = await this.usersService.findByEmail(body.email);
    if (existingUser) {
      throw new UnauthorizedException("Email already exists");
    }
    const user = await this.usersService.create(
      body.name,
      body.email,
      body.password
    );
    return this.authService.login(user);
  }
}
