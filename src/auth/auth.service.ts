import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) { }

  async signIn(email, pass) {
    try {
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const isPasswordValid = await bcrypt.compare(pass, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid password');
      }

      const payload = { email: user.email };
      const expiresIn = '30s';
      const secret = jwtConstants.secret;
      const access_token = await this.jwtService.signAsync(payload, { expiresIn, secret });

      return {
        success: true,
        message: 'Sign-in successful',
        access_token,
      };
    } catch (error) {
      // Error handling
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException(error.message);
      } else {
        throw new Error('An error occurred during sign-in');
      }
    }
  }



}
