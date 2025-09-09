// auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtRefreshGuard } from './jwt-refresh.guard';
import type { Request, Response } from 'express';
export interface RequestWithUserAndCookies extends Request {
  user: { sub: string; email: string; role: string }; // whatever your JWT payload has
  cookies: { [key: string]: string };
}
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto); // now returns only message
  }
@Post('login')
async login(
  @Body() dto: LoginDto,
  @Res({ passthrough: true }) res: Response,
) {
  const result = await this.authService.login(dto); // returns accessToken, refreshToken, user

  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // Return only what actually exists
  return {
    accessToken: result.accessToken,
    user: result.user,
  };
}

  @Post('refresh')
  async refresh(
    @Req() req: RequestWithUserAndCookies,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw new UnauthorizedException('No refresh token');

    // The AuthService can verify and decode the refresh token
    const tokens = await this.authService.refreshTokensFromToken(refreshToken);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken: tokens.accessToken };
  }
}
