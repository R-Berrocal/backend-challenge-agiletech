import { CreateEquipmentInput } from './create-equipment.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateEquipmentInput extends PartialType(CreateEquipmentInput) {
  @Field(() => ID)
  id: string;
}
