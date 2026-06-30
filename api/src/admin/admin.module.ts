import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

import { AdminGuard } from '../common/guards/admin.guard';
import { TelegramModule } from '../telegram/telegram.module';
import { UsersModule } from '../users/users.module';
import { SchedulerModule } from '../scheduler/scheduler.module';

@Module({
  imports: [UsersModule, TelegramModule, SchedulerModule],
  controllers: [AdminController],
  providers: [AdminService, AdminGuard],
})
export class AdminModule {}
