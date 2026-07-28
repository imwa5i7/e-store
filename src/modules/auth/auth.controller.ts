import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { AuthService } from './services/auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Req } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto);
  }

  @Post('logout')
  logout() {
    return this.authService.logout();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Req() req: { user: JwtPayload }) {
    return this.authService.profile(req.user);
  }
}
