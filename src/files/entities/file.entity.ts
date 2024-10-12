import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  AfterLoad,
  AfterInsert,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Allow } from 'class-validator';
import { EntityHelper } from 'src/utils/entity-helper';
import appConfig from '../../config/app.config';
import { AppConfig } from 'src/config/config.type';
import { User } from 'src/users/entities/user.entity';

@Entity({ name: 'files' })
export class FileEntity extends EntityHelper<string> {
  @ApiProperty({ example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  name: string;

  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  filename: string;

  @Allow()
  @Column()
  url: string;

  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  adapter: string;

  @IsOptional()
  @IsNumber()
  @Column({ nullable: true })
  height: number;

  @IsOptional()
  @IsNumber()
  @Column({ nullable: true })
  width: number;

  @IsOptional()
  @IsNumber()
  @Column({ nullable: true })
  size: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @AfterLoad()
  @AfterInsert()
  updatePath() {
    if (this.url.indexOf('/') === 0) {
      this.url = (appConfig() as AppConfig).backendDomain + this.url;
    }
  }

  @OneToMany(
    () => {
      return User;
    },
    (user) => {
      return user.avatar;
    },
  )
  users?: User[];
}
