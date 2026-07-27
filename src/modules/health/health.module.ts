import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { PrismaModule } from '../../database';

import { HealthController } from './health.controller';
import { PrismaHealthIndicator } from './indicators/prisma.health';

@Module({
  imports: [PrismaModule, TerminusModule],
  controllers: [HealthController],
  providers: [PrismaHealthIndicator],
})
export class HealthModule {}
