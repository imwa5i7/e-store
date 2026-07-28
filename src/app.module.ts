import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './database';
import { LoggerModule } from './core/logger/logger.module';

import { configuration, envValidationSchema } from './core/config';
import { HealthModule } from './modules/health/health.module';
import { UsersModule } from './modules/users';
import { PasswordService } from './modules/auth/services/jwt.services.';
import { LocalStrategy } from './modules/auth/strategies/local.strategy';
import { JwtStrategy } from './modules/auth/strategies/jwt.strategy';
import { AuthModule } from './modules/auth';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV ?? 'development'}`],
      load: configuration,
      validationSchema: envValidationSchema,
    }),
    PrismaModule,
    LoggerModule,
    HealthModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, PasswordService, JwtStrategy, LocalStrategy],
})
export class AppModule {}
