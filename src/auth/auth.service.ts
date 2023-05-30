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

      // Generate access token
      const access_token = await this.jwtService.signAsync(payload, {
        expiresIn,
        secret,
      });

      // Generate refresh token
      const refresh_token = await this.jwtService.signAsync(payload, {
        expiresIn: '7d', // Set the refresh token expiration as per your requirement
        secret,
      });

      return {
        success: true,
        message: 'Sign-in successful',
        access_token,
        refresh_token,
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
  async refreshToken(refreshToken: string): Promise<any> {
    try {
      // Verify the refresh token
      const decoded = await this.jwtService.verifyAsync(refreshToken, {
        secret: jwtConstants.secret,
      });

      // Check if the token is valid
      if (!decoded || !decoded.email) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const payload = { email: decoded.email };
      const expiresIn = '10s';
      const secret = jwtConstants.secret;

      // Generate a new access token
      const access_token = await this.jwtService.signAsync(payload, {
        expiresIn,
        secret,
      });

      return {
        success: true,
        message: 'Token refreshed successfully',
        access_token,
      };
    } catch (error) {
      // Error handling
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException(error.message);
      } else {
        throw new Error('An error occurred during token refresh');
      }
    }
  }

}
