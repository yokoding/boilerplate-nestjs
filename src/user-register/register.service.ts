import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from 'src/users/entities/user.entity';
import { RoleEnum } from 'src/roles/roles.enum';
import { StatusEnum } from 'src/constant/status.enum';
import { Role } from 'src/roles/entities/role.entity';

@Injectable()
export class RegisterService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async registerUser(createDto: RegisterUserDto): Promise<User> {
    const role = await this.roleRepository.findOne({
      where: { id: RoleEnum.user },
    });
    if (!role) {
      throw new Error('Role not found');
    }

    const user = new User();
    user.name = createDto.name;
    user.email = createDto.email;
    user.password = createDto.password;
    user.role = role;
    user.status = StatusEnum.active;
    const savedUser = await this.userRepository.save(user);

    return savedUser;
  }
}
