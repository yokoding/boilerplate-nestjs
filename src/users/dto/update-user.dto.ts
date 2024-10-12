import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { StatusEnum } from 'src/constant/status.enum';
import { Role } from '../../roles/entities/role.entity';
import {
  IsEmail,
  IsOptional,
  IsNotEmpty,
  MinLength,
  IsDateString,
  Validate,
} from 'class-validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';
import { FileEntity } from 'src/files/entities/file.entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ example: 'Ahmad' })
  @IsNotEmpty()
  name?: string;

  @ApiProperty({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  @IsOptional()
  @Validate(IsNotExist, ['User'])
  @IsEmail()
  email?: string | null;

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

  @ApiProperty()
  @IsOptional()
  status?: StatusEnum.active | StatusEnum.inactive;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  id?: number;

  hash?: string | null;
}
