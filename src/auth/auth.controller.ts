import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { User } from '../users/users.model';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() user: User): Promise<any> {
    return this.authService.signIn(user.email, user.password);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  refreshToken(@Body('refresh_token') refreshToken: string): Promise<any> {
    return this.authService.refreshToken(refreshToken);
  }
}
