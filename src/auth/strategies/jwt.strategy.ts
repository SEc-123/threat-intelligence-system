import { Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends Strategy {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: (req) => req.cookies?.access_token,
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: false,
    }, async (payload, done) => {
      try {
        const user = await this.authService.validateUser(payload);
        done(null, user);
      } catch (err) {
        done(err, false);
      }
    });
  }
}
