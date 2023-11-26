import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateEquipmentInput,
  EquipmentOutput,
} from './dto/create-equipment.input';
import { UpdateEquipmentInput } from './dto/update-equipment.input';
import { Equipment } from './entities/equipment.entity';

@Injectable()
export class EquipmentsService {
  private logger = new Logger(EquipmentsService.name);
  constructor(
    @InjectRepository(Equipment)
    private readonly equipmentRepository: Repository<Equipment>,
  ) {}
  async create(
    createEquipmentInput: CreateEquipmentInput,
  ): Promise<EquipmentOutput> {
    try {
      const equipment = this.equipmentRepository.create(createEquipmentInput);

      return {
        ok: true,
        equipment: await this.equipmentRepository.save(equipment),
      };
    } catch (error) {
      this.logger.error(error);
      return {
        ok: false,
        error: error.message,
      };
    }
  }

  async findAll(): Promise<Equipment[]> {
    try {
      return await this.equipmentRepository.find({
        relations: ['reports'],
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  async findOneEquipment(id: string): Promise<EquipmentOutput> {
    try {
      const equipment = await this.findOne(id);
      if (!equipment) {
        throw new NotFoundException('User not found');
      }
      return {
        ok: true,
        equipment,
      };
    } catch (error) {
      this.logger.error(error);
      return {
        ok: false,
        error: error.message,
      };
    }
  }

  async update(
    id: string,
    updateEquipmentInput: UpdateEquipmentInput,
  ): Promise<EquipmentOutput> {
    try {
      await this.findOne(id);
      const equipment = await this.equipmentRepository.preload({
        id,
        ...updateEquipmentInput,
      });

      await this.equipmentRepository.save(equipment);
      return {
        ok: true,
        equipment,
      };
    } catch (error) {
      this.logger.error(error);
      return {
        ok: false,
        error: error.message,
      };
    }
  }

  async remove(id: string): Promise<EquipmentOutput> {
    try {
      const equipment = await this.findOne(id);
      await this.equipmentRepository.softDelete(id);
      return {
        ok: true,
        equipment,
      };
    } catch (error) {
      this.logger.error(error);
      return {
        ok: false,
        error: error.message,
      };
    }
  }

  async findOne(id: string) {
    const equipment = await this.equipmentRepository.findOne({
      where: { id },
      relations: ['reports'],
    });
    if (!equipment) {
      throw new NotFoundException('Equipment not found');
    }
    return equipment;
  }
}
