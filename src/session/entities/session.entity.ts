import { Entity, Index, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { EntityHelper } from 'src/utils/entity-helper';

@Entity({ name: 'sessions' })
export class Session extends EntityHelper {
  @ManyToOne(() => User, {
    eager: true,
  })
  @Index()
  user: User;
}
