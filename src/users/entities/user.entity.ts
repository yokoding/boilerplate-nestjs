import {
  Column,
  AfterLoad,
  Entity,
  Index,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { FileEntity } from 'src/files/entities/file.entity';
import bcrypt from 'bcryptjs';
import { StatusEnum } from 'src/constant/status.enum';
import { EntityHelper } from 'src/utils/entity-helper';
import { AuthProvidersEnum } from 'src/auth/auth-providers.enum';
import { Exclude, Expose } from 'class-transformer';
import { IsDateString } from 'class-validator';

@Entity({ name: 'users' })
export class User extends EntityHelper {
  @Column()
  name: string;

  @Column({ type: String, unique: true, nullable: true })
  email: string | null;

  @Column({ type: 'timestamp', nullable: true })
  email_verified_at: Date;

  @Column({ nullable: true })
  @Expose({ groups: ['me', 'super_admin', 'admin'] })
  username: string;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Exclude({ toPlainOnly: true })
  public previousPassword: string;

  @AfterLoad()
  public loadPreviousPassword(): void {
    this.previousPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async setPassword() {
    if (this.previousPassword !== this.password && this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  pob: string;

  @Column({ nullable: true })
  @IsDateString()
  dob: string;

  @Column({ nullable: true })
  address: string;

  @Column({ default: AuthProvidersEnum.email })
  @Expose({ groups: ['me', 'super_admin', 'admin'] })
  provider: string;

  @Index()
  @Column({ type: String, nullable: true })
  @Expose({ groups: ['me', 'super_admin', 'admin'] })
  socialId: string | null;

  @Column({ type: String, nullable: true })
  @Index()
  @Exclude({ toPlainOnly: true })
  hash: string | null;

  @ManyToOne(() => FileEntity, {
    eager: true,
  })
  avatar?: FileEntity | null;

  @ManyToOne(() => Role, {
    eager: true,
  })
  role?: Role | null;

  @Column({ default: StatusEnum.active })
  status?: StatusEnum.active | StatusEnum.inactive;
}
