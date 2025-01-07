import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { sub: string; email: string; name: string }) {
    try {
      if (!payload.sub) {
        throw new UnauthorizedException(
          "Invalid token payload - missing sub field"
        );
      }

      const user = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
      };

      this.logger.debug(`JWT validation successful for user: ${user.email}`);
      return user;
    } catch (error) {
      throw new UnauthorizedException(
        "Token validation failed: " + error.message
      );
    }
  }
}
