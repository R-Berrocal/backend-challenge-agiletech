import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportInput, ReportOutput } from './dto/create-report.input';
import { UpdateReportInput } from './dto/update-report.input';
import { Report } from './entities/report.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { EquipmentsService } from 'src/equipments/equipments.service';
import { Equipment } from 'src/equipments/entities/equipment.entity';

@Injectable()
export class ReportsService {
  private logger = new Logger(ReportsService.name);

  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    private readonly usersService: UsersService,
    private readonly equipmentsService: EquipmentsService,
  ) {}
  async create(createReportInput: CreateReportInput): Promise<ReportOutput> {
    try {
      const { user, equipment } =
        await this.validateRelations(createReportInput);

      const report = this.reportRepository.create({
        ...createReportInput,
        user,
        equipment,
      });

      return {
        ok: true,
        report: await this.reportRepository.save(report),
      };
    } catch (error) {
      this.logger.error(error);
      return {
        ok: false,
        error: error.message,
      };
    }
  }

  async findAll(): Promise<Report[]> {
    try {
      return await this.reportRepository.find({
        relations: ['user, equipment'],
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  async findOneReport(id: string): Promise<ReportOutput> {
    try {
      const report = await this.findOne(id);
      return {
        ok: true,
        report,
      };
    } catch (error) {
      this.logger.error(error);
      return {
        ok: false,
        error: error.message,
      };
    }
  }

  async update(id: string, updateReportInput: UpdateReportInput) {
    await this.findOne(id);
    try {
      const report = await this.reportRepository.preload({
        id,
        ...updateReportInput,
      });

      await this.reportRepository.save(report);
      return {
        ok: true,
        report,
      };
    } catch (error) {
      this.logger.error(error);
      return {
        ok: false,
        error: error.message,
      };
    }
  }

  async remove(id: string): Promise<ReportOutput> {
    const report = await this.findOne(id);
    try {
      await this.reportRepository.softDelete(id);
      return {
        ok: true,
        report,
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
    const report = await this.reportRepository.findOne({
      where: { id },
      relations: ['user', 'equipment'],
    });
    if (!report) {
      throw new NotFoundException('Reprort not found');
    }
    return report;
  }
  async validateRelations(reportDto: CreateReportInput | UpdateReportInput) {
    let user: User | undefined;
    let equipment: Equipment | undefined;

    if (reportDto.equipmentId) {
      user = await this.usersService.findOne(reportDto.userId);
    }

    if (reportDto.userId) {
      equipment = await this.equipmentsService.findOne(reportDto.equipmentId);
    }

    return {
      user,
      equipment,
    };
  }
}
