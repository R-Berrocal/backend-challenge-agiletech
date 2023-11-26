import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { CoreEntity } from 'src/common/entities/core.entity';

@ObjectType()
@Entity()
export class Equipment extends CoreEntity {
  @Field(() => String)
  @Column({ type: 'varchar' })
  name: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', nullable: true })
  category?: string;

  @Field(() => Number)
  @Column({ type: 'int', default: 0 })
  stock: number;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', nullable: true })
  imageUrl?: string;
}
