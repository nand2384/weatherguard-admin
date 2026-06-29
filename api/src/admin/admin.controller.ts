import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';

import { AdminService } from './admin.service';
import { AdminGuard } from '../common/guards/admin.guard';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  async getStats() {
    return this.adminService.getStats();
  }

  @Get('pending-users')
  async getPendingUsers() {
    return this.adminService.getPendingUsers();
  }

  @Get('approved-users')
  async getApprovedUsers() {
    return this.adminService.getApprovedUsers();
  }

  @Patch('approve/:id')
  async approveUser(@Param('id') id: string) {
    return this.adminService.approveUser(id);
  }

  @Patch('reject/:id')
  async rejectUser(@Param('id') id: string) {
    return this.adminService.rejectUser(id);
  }
}
