import { Injectable } from '@nestjs/common';

import { ApprovalStatus } from '../common/enums/user.enum';
import { TelegramService } from '../telegram/telegram.service';
import { UsersService } from '../users/users.service';
import { SchedulerService } from '../scheduler/scheduler.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly usersService: UsersService,
    private readonly telegramService: TelegramService,
    private readonly schedulerService: SchedulerService,
  ) {}

  async getStats() {
    return this.usersService.getDashboardStats();
  }

  async getPendingUsers() {
    return this.usersService.findByApprovalStatus(ApprovalStatus.PENDING);
  }

  async getApprovedUsers() {
    return this.usersService.findByApprovalStatus(ApprovalStatus.APPROVED);
  }

  async approveUser(id: string) {
    const user = await this.usersService.approveUser(id);

    await this.telegramService.sendApprovalMessage(user);
    
    // Send immediate weather alert check results
    await this.schedulerService.sendImmediateAlerts(user);

    return user;
  }

  async rejectUser(id: string) {
    const user = await this.usersService.rejectUser(id);

    await this.telegramService.sendRejectionMessage(user);

    return user;
  }
}
