import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';

@ApiTags('Client - Register')
@Controller({
  path: 'client/register',
  version: '1',
})
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post('user')
  @HttpCode(HttpStatus.CREATED)
  async registerUser(@Body() createDto: RegisterUserDto): Promise<User> {
    return await this.registerService.registerUser(createDto);
  }
}
