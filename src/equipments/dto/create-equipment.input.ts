import { InputType, Field, Int, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { Equipment } from '../entities/equipment.entity';
import { CoreOutput } from 'src/common/dto/core.output';

@InputType()
export class CreateEquipmentInput {
  @Field(() => String)
  @IsNotEmpty()
  @MinLength(10)
  name: string;

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  description: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  category?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  stock?: number;

  @Field(() => String)
  @IsOptional()
  imageUrl?: string;
}

@ObjectType()
export class EquipmentOutput extends CoreOutput {
  @Field(() => Equipment, { nullable: true })
  equipment?: Equipment;
}
