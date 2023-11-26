import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsResolver } from './reports.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { UsersModule } from 'src/users/users.module';
import { EquipmentsModule } from 'src/equipments/equipments.module';

@Module({
  imports: [TypeOrmModule.forFeature([Report]), UsersModule, EquipmentsModule],
  providers: [ReportsResolver, ReportsService],
})
export class ReportsModule {}
