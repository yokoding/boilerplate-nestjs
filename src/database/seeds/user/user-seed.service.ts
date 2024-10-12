import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEnum } from 'src/roles/roles.enum';
import { StatusEnum } from 'src/constant/status.enum';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async run() {
    const countSuperAdmin = await this.repository.count({
      where: {
        role: {
          id: RoleEnum.super_admin,
        },
      },
    });

    if (!countSuperAdmin) {
      await this.repository.save(
        this.repository.create({
          name: 'Super Admin',
          email: 'super-admin@gmail.com',
          password: '12345678',
          role: {
            id: RoleEnum.super_admin,
          },
          status: StatusEnum.active,
        }),
      );
    }

    const countAdmin = await this.repository.count({
      where: {
        role: {
          id: RoleEnum.admin,
        },
      },
    });

    if (!countAdmin) {
      await this.repository.save(
        this.repository.create({
          name: 'Admin',
          email: 'admin@gmail.com',
          password: '12345678',
          role: {
            id: RoleEnum.admin,
          },
          status: StatusEnum.active,
        }),
      );
    }
  }
}
