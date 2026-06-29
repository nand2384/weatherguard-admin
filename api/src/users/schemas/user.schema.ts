import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import {
  UserRole,
  ApprovalStatus,
  AuthProvider,
  AlertFrequency,
} from '../../common/enums/user.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret: any) => {
      ret.id = ret._id.toString();
      return ret;
    },
  },
  toObject: { virtuals: true },
})
export class User {
  @Prop({ required: true })
  name!: string;

  @Prop({
    required: true,
    unique: true,
  })
  email!: string;

  @Prop({
    required: true,
    enum: AuthProvider,
  })
  provider!: string;

  @Prop({
    required: true,
    unique: true,
  })
  providerId!: string;

  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.USER,
  })
  role!: UserRole;

  @Prop({
    type: String,
    enum: ApprovalStatus,
    default: ApprovalStatus.INCOMPLETE,
  })
  approvalStatus!: ApprovalStatus;

  @Prop()
  city?: string;

  @Prop()
  country?: string;

  @Prop()
  latitude?: number;

  @Prop()
  longitude?: number;

  @Prop({
    default: false,
  })
  telegramConnected!: boolean;

  @Prop()
  telegramChatId?: string;

  @Prop({
    type: String,
    enum: AlertFrequency,
  })
  alertFrequency?: AlertFrequency;

  @Prop({
    default: null,
  })
  telegramLinkToken?: string;

  @Prop()
  telegramLinkedAt?: Date;
}
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ approvalStatus: 1 });
UserSchema.index({ telegramLinkToken: 1 });
UserSchema.index({ telegramConnected: 1, approvalStatus: 1 });
