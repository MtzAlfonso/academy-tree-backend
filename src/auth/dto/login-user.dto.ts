import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { PASSWORD_PATTERN } from '../helpers/patterns';

export class LoginUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(PASSWORD_PATTERN, {
    message:
      'The password must have a Uppercase, lowercase, number and special character',
  })
  password: string;
}
