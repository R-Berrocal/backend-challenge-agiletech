import { ObjectType, Field } from '@nestjs/graphql';
import { Entity, Column, BeforeInsert, OneToMany } from 'typeorm';
import { UserRole } from 'src/enums/user-role.enum';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Report } from 'src/reports/entities/report.entity';

@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Field(() => String)
  @Column({ type: 'varchar' })
  name: string;

  @Field(() => String)
  @Column({ type: 'varchar' })
  lastName: string;

  @Field(() => String)
  @Column({ type: 'varchar', unique: true })
  email: string;

  @Field(() => String)
  @Column({ type: 'varchar' })
  password: string;

  @Field(() => UserRole)
  @Column({ type: 'enum', enum: UserRole, default: UserRole.CLIENT })
  role: UserRole;

  @Field(() => [Report])
  @OneToMany(() => Report, (report) => report.user)
  reports: Report;

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }
}
