import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  UnauthorizedException,
  Get,
  Query,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { Request, Response } from 'express';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

export interface RequestWithUserAndCookies extends Request {
  user: { sub: string; email: string; role: string };
  cookies: { [key: string]: string };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(RolesGuard)
  @Roles('Admin')
  @Get()
  async getAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('sortField') sortField?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('role') role?: string,
    @Query('status') status?: string,
  ) {
    return this.authService.getAllUsers({
      page,
      limit,
      search,
      sortField: sortField as any,
      sortOrder,
      role,
      status,
    });
  }

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

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

    const tokens = await this.authService.refreshTokensFromToken(refreshToken);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken: tokens.accessToken };
  }

  // auth.controller.ts
  @Patch('update-role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  updateRole(@Body() dto: UpdateRoleDto) {
    return this.authService.updateUserRole(dto);
  }

  @Patch('update-status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  updateStatus(@Body() dto: UpdateStatusDto) {
    return this.authService.updateUserStatus(dto);
  }
}
