import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ReportsService } from './reports.service';
import { Report } from './entities/report.entity';
import { CreateReportInput, ReportOutput } from './dto/create-report.input';
import { UpdateReportInput } from './dto/update-report.input';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserRole } from 'src/enums/user-role.enum';

@Resolver(() => Report)
export class ReportsResolver {
  constructor(private readonly reportsService: ReportsService) {}

  @Auth(UserRole.ADMIN, UserRole.TECHNICIAN)
  @Mutation(() => ReportOutput)
  createReport(@Args('input') createReportInput: CreateReportInput) {
    return this.reportsService.create(createReportInput);
  }

  @Auth(UserRole.ADMIN, UserRole.TECHNICIAN)
  @Query(() => [Report], { name: 'getReports' })
  findAll() {
    return this.reportsService.findAll();
  }

  @Auth(UserRole.ADMIN, UserRole.TECHNICIAN)
  @Query(() => ReportOutput, { name: 'getReport' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.reportsService.findOneReport(id);
  }

  @Auth(UserRole.ADMIN, UserRole.TECHNICIAN)
  @Mutation(() => ReportOutput)
  updateReport(
    @Args('updateReportInput') updateReportInput: UpdateReportInput,
  ) {
    return this.reportsService.update(updateReportInput.id, updateReportInput);
  }

  @Auth(UserRole.ADMIN, UserRole.TECHNICIAN)
  @Mutation(() => ReportOutput)
  removeReport(@Args('id', { type: () => ID }) id: string) {
    return this.reportsService.remove(id);
  }
}
