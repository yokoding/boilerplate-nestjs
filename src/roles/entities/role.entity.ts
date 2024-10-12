import {
  Column,
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsOptional, IsNumber } from 'class-validator';

@Entity({ name: 'roles' })
export class Role {
  @ApiProperty({ example: 1 })
  @PrimaryColumn()
  id: number;

  @Allow()
  @ApiProperty({ example: 'Admin' })
  @Column()
  name?: string;

  @IsOptional()
  @IsNumber()
  status: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
