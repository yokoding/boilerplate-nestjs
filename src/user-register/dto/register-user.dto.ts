import { IsString, IsEmail, MinLength, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';
import { Match } from 'src/utils/validators/match.validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';

export class RegisterUserDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  @Validate(IsNotExist, ['User'], {
    message: 'email already exist!',
  })
  @IsEmail()
  email: string;

  @ApiProperty()
  @MinLength(8)
  password: string;

  @ApiProperty()
  @MinLength(8)
  @Match('password', { message: 'confirmPasswordDoesNotMatch' })
  confirm_password: string;
}
