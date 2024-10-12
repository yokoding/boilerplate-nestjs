import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../roles/entities/role.entity';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MinLength,
  Validate,
  IsDateString,
} from 'class-validator';
import { StatusEnum } from 'src/constant/status.enum';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';
import { FileEntity } from 'src/files/entities/file.entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';

export class CreateUserDto {
  @ApiProperty({ example: 'Ahmad' })
  @IsNotEmpty()
  name?: string;

  @ApiProperty({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @Validate(IsNotExist, ['User'], {
    message: 'email already exist!',
  })
  @IsEmail()
  email: string | null;

  @ApiProperty()
  @IsOptional()
  username?: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(8)
  password?: string;

  @ApiProperty()
  @IsOptional()
  phone?: string;

  @ApiProperty()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: 'YYYY-MM-DD' })
  @IsOptional()
  @IsDateString()
  dob?: string;

  @ApiProperty()
  @IsOptional()
  socialId?: string | null;

  @ApiProperty()
  @IsOptional()
  provider?: string;

  @ApiProperty({ type: () => FileEntity })
  @IsOptional()
  @Validate(IsExist, ['FileEntity', 'id'], {
    message: 'imageNotExists',
  })
  avatar?: FileEntity | null;

  @ApiProperty({ type: Role })
  @IsOptional()
  @Validate(IsExist, ['Role', 'id'], {
    message: 'roleNotExists',
  })
  role?: Role | null;

  hash?: string | null;

  @ApiProperty()
  @IsOptional()
  status?: StatusEnum.active | StatusEnum.inactive = StatusEnum.active;
}
