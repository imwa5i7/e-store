import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserResponseDto } from '@/modules/users/dto/user-response.dto';
import { UsersRepository } from '@/modules/users/repositories/users.repository';

import { LoginDto } from '../dto/login.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { RegisterDto } from '../dto/register.dto';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersRepository: UsersRepository,
  ) {}

  private getSignOptions(
    secretKey: string,
    expiresInKey: string,
  ): JwtSignOptions {
    return {
      secret: this.configService.getOrThrow<string>(secretKey),
      expiresIn: this.configService.getOrThrow<string>(
        expiresInKey,
      ) as JwtSignOptions['expiresIn'],
    };
  }

  async generateTokens(payload: JwtPayload): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        payload,
        this.getSignOptions('jwt.secret', 'jwt.expiresIn'),
      ),
      this.jwtService.signAsync(
        payload,
        this.getSignOptions('jwt.refreshSecret', 'jwt.refreshExpiresIn'),
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersRepository.findByEmail(
      registerDto.email,
    );

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 12);

    const user = await this.usersRepository.create({
      email: registerDto.email,
      password: hashedPassword,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
    });

    const userResponse = new UserResponseDto(user);
    const tokens = await this.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      message: 'User registered successfully.',
      user: userResponse,
      ...tokens,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      message: 'Login successful.',
      user,
      ...tokens,
    };
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserResponseDto | null> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    return new UserResponseDto(user);
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    let payload: JwtPayload;

    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(
        refreshTokenDto.refreshToken,
        {
          secret: this.configService.getOrThrow<string>('jwt.refreshSecret'),
        },
      );
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const existingUser = await this.usersRepository.findById(payload.sub);

    if (!existingUser) {
      throw new UnauthorizedException('User not found');
    }

    const user = new UserResponseDto(existingUser);
    const tokens = await this.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      message: 'Tokens refreshed successfully.',
      user,
      ...tokens,
    };
  }

  logout() {
    return {
      message: 'Logout successful.',
    };
  }

  async profile(user: JwtPayload) {
    const existingUser = await this.usersRepository.findById(user.sub);

    if (!existingUser) {
      throw new UnauthorizedException('User not found');
    }

    return {
      message: 'Profile fetched successfully.',
      user: new UserResponseDto(existingUser),
    };
  }

  async validateJwtUser(payload: JwtPayload): Promise<JwtPayload | null> {
    const existingUser = await this.usersRepository.findById(payload.sub);

    if (!existingUser) {
      return null;
    }

    return payload;
  }
}
