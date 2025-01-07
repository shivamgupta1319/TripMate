import { Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    this.logger.debug(`Attempting to validate user: ${email}`);
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      this.logger.debug(`User validation successful: ${email}`);
      return result;
    }
    this.logger.debug(`User validation failed: ${email}`);
    return null;
  }

  async login(user: any) {
    this.logger.debug(`Generating token for user: ${user.email}`);
    const payload = {
      email: user.email,
      sub: user.id,
      name: user.name,
    };

    this.logger.debug(`Payload for token: ${JSON.stringify(payload)}`);

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("JWT_SECRET"),
    });

    this.logger.debug(`Token generated successfully for user: ${user.email}`);
    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}
