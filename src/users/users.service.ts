import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { NullableType } from 'src/utils/types/nullable.type';
import { MailService } from 'src/mail/mail.service';
import { RoleEnum } from 'src/roles/roles.enum';

@Injectable()
export class UsersService {
  constructor(
    private mailService: MailService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(
    createProfileDto: CreateUserDto,
    isAdmin: boolean,
  ): Promise<User> {
    const newUser = this.usersRepository.save(
      this.usersRepository.create(createProfileDto),
    );

    if (isAdmin) {
      console.log(isAdmin);
      // await this.mailService.userCreatedByAdmin({
      //   to: createProfileDto.email,
      //   initialPass: createProfileDto.password,
      // });
    }

    return newUser;
  }

  async findAllUser(
    page: number,
    limit: number,
    sort_by: string,
    order_by: string,
    q: string,
  ): Promise<{ data: User[]; total: number }> {
    const base: FindOptionsWhere<User> = { role: { id: RoleEnum.user } };
    const w: FindOptionsWhere<User>[] = [];

    if (q) {
      w.push({
        ...base,
        name: ILike(`%${q}%`),
      });
    } else {
      w.push(base);
    }

    const o: any = {};

    if (order_by && sort_by) {
      o[order_by] = sort_by;
    }

    const [data, total] = await this.usersRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      where: w,
      order: o,
      relations: {
        avatar: true,
        role: true,
      },
    });
    return { data, total };
  }

  async countData(): Promise<number> {
    return this.usersRepository.count();
  }

  async findOne(fields: EntityCondition<User>): Promise<NullableType<User>> {
    return this.usersRepository.findOne({
      where: fields,
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne({ id });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.usersRepository.update(id, updateUserDto);
    return this.findOne({ id }) as Promise<User>;
  }

  async softDelete(id: User['id']): Promise<void> {
    await this.usersRepository.softDelete(id);
  }
}
