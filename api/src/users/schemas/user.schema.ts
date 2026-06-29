import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

import { UserRole, ApprovalStatus, AuthProvider } from "src/common/enums/user.enum";

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
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
  role?: UserRole;

  @Prop({
    type: String,
    enum: ApprovalStatus,
    default: ApprovalStatus.PENDING,
  })
  approvalStatus: ApprovalStatus = ApprovalStatus.PENDING;

  @Prop()
  city?: string;

  @Prop()
  country?: string;

  @Prop()
  latitude?: number;

  @Prop()
  longitude?: number;

  @Prop()
  telegramChatId?: string;

  @Prop()
  telegramUsername?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);