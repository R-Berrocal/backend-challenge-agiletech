import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { EquipmentsService } from './equipments.service';
import { Equipment } from './entities/equipment.entity';
import {
  CreateEquipmentInput,
  EquipmentOutput,
} from './dto/create-equipment.input';
import { UpdateEquipmentInput } from './dto/update-equipment.input';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserRole } from 'src/enums/user-role.enum';

@Resolver(() => Equipment)
export class EquipmentsResolver {
  constructor(private readonly equipmentsService: EquipmentsService) {}

  @Auth(UserRole.ADMIN)
  @Mutation(() => EquipmentOutput)
  createEquipment(@Args('input') createEquipmentInput: CreateEquipmentInput) {
    return this.equipmentsService.create(createEquipmentInput);
  }

  @Auth(UserRole.ADMIN)
  @Query(() => [Equipment], { name: 'getEquipments' })
  findAll() {
    return this.equipmentsService.findAll();
  }

  @Auth(UserRole.ADMIN)
  @Query(() => EquipmentOutput, { name: 'getEquipment' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.equipmentsService.findOneEquipment(id);
  }

  @Auth(UserRole.ADMIN)
  @Mutation(() => EquipmentOutput)
  updateEquipment(@Args('input') updateEquipmentInput: UpdateEquipmentInput) {
    return this.equipmentsService.update(
      updateEquipmentInput.id,
      updateEquipmentInput,
    );
  }

  @Auth(UserRole.ADMIN)
  @Mutation(() => EquipmentOutput)
  removeEquipment(@Args('id', { type: () => ID }) id: string) {
    return this.equipmentsService.remove(id);
  }
}
