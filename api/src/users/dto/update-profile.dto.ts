import {
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsString,
} from 'class-validator';

import { AlertFrequency } from '../../common/enums/user.enum';

export class UpdateProfileDto {
  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsString()
  @IsNotEmpty()
  country!: string;

  @IsLatitude()
  latitude!: number;

  @IsLongitude()
  longitude!: number;

  @IsEnum(AlertFrequency)
  alertFrequency!: AlertFrequency;
}
