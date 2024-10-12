import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  SerializeOptions,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles/roles.guard';
import { User } from './entities/user.entity';
import { NullableType } from 'src/utils/types/nullable.type';
import { standardPagination } from 'src/utils/standard-pagination';
import { StandardPaginationResultType } from 'src/utils/types/standard-pagination-result.type';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseController } from 'src/utils/base.controller';

@ApiBearerAuth()
@Roles(RoleEnum.super_admin, RoleEnum.admin)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('User')
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController extends BaseController<User> {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  @SerializeOptions({
    groups: ['super_admin', 'admin'],
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProfileDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createProfileDto, true);
  }

  @SerializeOptions({
    groups: ['super_admin', 'admin'],
  })
  @Get('clients')
  @HttpCode(HttpStatus.OK)
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limit of items per page',
  })
  @ApiQuery({
    name: 'sort_by',
    required: false,
    type: String,
    description: 'Sorting data ASC / DESC',
  })
  @ApiQuery({
    name: 'order_by',
    required: false,
    type: String,
    description: 'Ordering data by selected field',
  })
  @ApiQuery({
    name: 'q',
    required: false,
    type: String,
    description: 'Search here .....',
  })
  async findAllUser(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('sort_by') sort_by: string = 'DESC',
    @Query('order_by') order_by: string = 'createdAt',
    @Query('q') q: string,
  ): Promise<StandardPaginationResultType<User>> {
    page = page ?? 1;
    limit = limit ?? 10;

    if (limit > 100) {
      limit = 100;
    }

    const { data, total } = await this.usersService.findAllUser(
      page,
      limit,
      sort_by,
      order_by,
      q,
    );

    return standardPagination(data, total, page, limit);
  }

  @SerializeOptions({
    groups: ['super_admin', 'admin'],
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string): Promise<NullableType<User>> {
    return this.usersService.findOne({ id: +id });
  }

  @SerializeOptions({
    groups: ['super_admin', 'admin'],
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: number,
    @Body() updateProfileDto: UpdateUserDto,
  ): Promise<User> {
    updateProfileDto.id = id;
    return this.usersService.update(id, updateProfileDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number): Promise<void> {
    return this.usersService.softDelete(id);
  }
}
