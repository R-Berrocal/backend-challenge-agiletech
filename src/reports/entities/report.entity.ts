import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Equipment } from 'src/equipments/entities/equipment.entity';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
@Entity()
export class Report extends CoreEntity {
  @Field(() => String)
  @Column({ type: 'varchar', unique: true })
  code: string;

  @Field(() => String)
  @Column({ type: 'varchar' })
  description: string;

  @Field(() => Equipment)
  @ManyToOne(() => Equipment, (equipment) => equipment.reports)
  equipment: Equipment;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.reports)
  user: User;
}
