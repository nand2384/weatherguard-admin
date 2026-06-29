import { Injectable } from '@nestjs/common';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  async validateGoogleUser(profile: any) {
    let user = await this.usersService.findByEmail(
      profile.emails[0].value,
    );

    if (!user) {
      user = await this.usersService.createGoogleUser(profile);
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      approvalStatus: user.approvalStatus,
      telegramConnected: user.telegramConnected,
      profileCompleted:
        !!user.city &&
        !!user.country &&
        !!user.latitude &&
        !!user.longitude &&
        !!user.alertFrequency,
    };
  }
}