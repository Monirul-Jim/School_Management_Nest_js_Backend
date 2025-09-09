// auth/auth.service.ts
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from './schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ConflictException } from '@nestjs/common';
import { QueryBuilder } from 'src/common/QueryBuilder/QueryBuilder';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
@Injectable()
export class AuthService {
  constructor(
  @InjectModel(User.name) private userModel: Model<UserDocument>,
  private jwtService: JwtService,
) {}
  private async hashData(data: string): Promise<string> {
    return bcrypt.hash(data, 10);
  }

  private async getTokens(userId: string, role: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, role, email },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: process.env.JWT_ACCESS_EXPIRES,
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, role, email },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: process.env.JWT_REFRESH_EXPIRES,
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  async register(dto: RegisterDto): Promise<{ message: string }> {
    try {
      const hashedPassword = await this.hashData(dto.password);
      const user = new this.userModel({
        ...dto,
        role: dto.role || 'User',
        password: hashedPassword,
      });
      await user.save();

      return { message: 'User registered successfully' };
    } catch (error) {
      if (error.code === 11000 && error.keyValue?.email) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }
  async login(dto: LoginDto) {
  const user = await this.userModel.findOne({ email: dto.email }).exec();

  if (!user) {
    // Email not found
    throw new UnauthorizedException('Email does not exist');
  }

  const passwordValid = await bcrypt.compare(dto.password, user.password);
  if (!passwordValid) {
    // Password incorrect
    throw new UnauthorizedException('Your password is incorrect');
  }

  // Optional: check if user is blocked or deleted
  if (user.status === 'blocked') {
    throw new UnauthorizedException('User is blocked');
  }
  if (user.status === 'deleted') {
    throw new UnauthorizedException('User is deleted');
  }

  const tokens = await this.getTokens(user._id.toString(), user.role, user.email);
  user.refreshToken = await this.hashData(tokens.refreshToken);
  await user.save();

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  };
}


  async refreshTokensFromToken(refreshToken: string) {
  try {
    const payload = this.jwtService.verify(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET,
    });

    const user = await this.userModel.findById(payload.sub).exec();
    if (!user || !user.refreshToken) throw new UnauthorizedException('Access denied');

    const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isValid) throw new UnauthorizedException('Invalid refresh token');

    const tokens = await this.getTokens(user._id.toString(), user.role, user.email);
    user.refreshToken = await this.hashData(tokens.refreshToken);
    await user.save();

    return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
  } catch (err) {
    throw new UnauthorizedException('Invalid refresh token');
  }
}

 async getAllUsers(params: {
    page?: number;
    limit?: number;
    search?: string;
    sortField?: keyof User;
    sortOrder?: 'asc' | 'desc';
  }) {
    const qb = new QueryBuilder<UserDocument>(this.userModel, {
      page: params.page,
      limit: params.limit || 10,
      search: params.search,
      searchFields: ['firstName', 'lastName', 'email'],
      sortField: params.sortField || 'firstName',
      sortOrder: params.sortOrder || 'asc',
    });

    return qb.execute();
  }

   async updateUserRole(dto: UpdateRoleDto) {
  const user = await this.userModel.findById(dto.userId).exec();
  if (!user) throw new NotFoundException('User not found');

  user.role = dto.role;
  await user.save();
  return { message: 'User role updated successfully', user };
}

// Update user status via userId
async updateUserStatus(dto: UpdateStatusDto) {
  const user = await this.userModel.findById(dto.userId).exec();
  if (!user) throw new NotFoundException('User not found');

  user.status = dto.status;
  await user.save();
  return { message: 'User status updated successfully', user };
}


}
