import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { User, UserDocument } from './schemas/user.schema';
import {
  ApprovalStatus,
  AuthProvider,
  AlertFrequency,
} from '../common/enums/user.enum';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { RequestAccessDto } from './dto/request-access.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async findAll() {
    return this.userModel.find().exec();
  }

  async findByApprovalStatus(approvalStatus: ApprovalStatus) {
    return this.userModel.find({ approvalStatus }).exec();
  }

  async getDashboardStats() {
    const [pendingRequests, approvedUsers, totalUsers] = await Promise.all([
      this.userModel.countDocuments({
        approvalStatus: ApprovalStatus.PENDING,
      }),
      this.userModel.countDocuments({
        approvalStatus: ApprovalStatus.APPROVED,
      }),
      this.userModel.countDocuments(),
    ]);

    return {
      pendingRequests,
      approvedUsers,
      totalUsers,
    };
  }

  async findApprovedUsersWithTelegram() {
    return this.userModel
      .find({
        approvalStatus: ApprovalStatus.APPROVED,
        telegramConnected: true,
        telegramChatId: { $exists: true, $ne: null },
      })
      .exec();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string) {
    return this.userModel.findById(id).exec();
  }

  async createGoogleUser(profile: {
    id: string;
    displayName: string;
    emails: { value: string }[];
  }) {
    return this.userModel.create({
      name: profile.displayName,
      email: profile.emails[0].value,
      provider: AuthProvider.GOOGLE,
      providerId: profile.id,

      approvalStatus: ApprovalStatus.INCOMPLETE,
    });
  }

  async updateProfile(userId: string, data: UpdateProfileDto) {
    return this.userModel.findByIdAndUpdate(
      userId,
      {
        city: data.city,
        country: data.country,
        latitude: data.latitude,
        longitude: data.longitude,
        alertFrequency: data.alertFrequency,
      },
      {
        new: true,
      },
    );
  }

  async markTelegramConnected(userId: string, chatId: string) {
    return this.userModel.findByIdAndUpdate(
      userId,
      {
        telegramConnected: true,
        telegramChatId: chatId,
        telegramLinkToken: null,
        telegramLinkedAt: new Date(),
      },
      {
        new: true,
      },
    );
  }

  async saveTelegramLinkToken(userId: string, token: string) {
    return this.userModel.findByIdAndUpdate(
      userId,
      {
        telegramLinkToken: token,
      },
      {
        new: true,
      },
    );
  }

  async requestAccess(userId: string, dto: RequestAccessDto) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (
      !user.city ||
      !user.country ||
      !user.latitude ||
      !user.longitude ||
      !user.alertFrequency
    ) {
      throw new BadRequestException(
        'Complete your profile before requesting access.',
      );
    }

    if (!user.telegramConnected) {
      throw new BadRequestException(
        'Connect your Telegram account before requesting access.',
      );
    }

    user.approvalStatus = ApprovalStatus.PENDING;

    await user.save();

    return {
      message: 'Access request submitted successfully.',
    };
  }

  async findByTelegramLinkToken(token: string) {
    return this.userModel.findOne({
      telegramLinkToken: token,
    });
  }

  async approveUser(id: string) {
    const user = await this.userModel
      .findByIdAndUpdate(
        id,
        {
          approvalStatus: ApprovalStatus.APPROVED,
        },
        {
          new: true,
        },
      )
      .exec();

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }

  async rejectUser(id: string) {
    const user = await this.userModel
      .findByIdAndUpdate(
        id,
        {
          approvalStatus: ApprovalStatus.REJECTED,
        },
        {
          new: true,
        },
      )
      .exec();

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }
}
