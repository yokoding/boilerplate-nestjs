import { instanceToPlain } from 'class-transformer';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  AfterLoad,
  BaseEntity,
} from 'typeorm';

export class EntityHelper<IDType = number> extends BaseEntity {
  __entity?: string;

  @PrimaryGeneratedColumn()
  id: IDType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @AfterLoad()
  setEntityName() {
    this.__entity = this.constructor.name;
  }

  toJSON() {
    return instanceToPlain(this);
  }
}
