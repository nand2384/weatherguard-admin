import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { TelegramController } from './telegram.controller';
import { TelegramService } from './telegram.service';

import { User, UserSchema } from '../users/schemas/user.schema';
import { UsersModule } from '../users/users.module';
import { WeatherModule } from '../weather/weather.module';

import { BotService } from './bot.service';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    WeatherModule,

    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],

  controllers: [TelegramController],

  providers: [TelegramService, BotService],

  exports: [TelegramService],
})
export class TelegramModule {}