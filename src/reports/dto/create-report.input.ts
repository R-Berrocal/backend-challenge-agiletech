import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { CoreOutput } from 'src/common/dto/core.output';
import { Report } from '../entities/report.entity';

@InputType()
export class CreateReportInput {
  @Field(() => String)
  @IsNotEmpty()
  code: string;

  @Field(() => String)
  @IsNotEmpty()
  description: string;

  @Field(() => String)
  @IsUUID()
  equipmentId: string;

  @Field(() => String)
  @IsUUID()
  userId: string;
}

@ObjectType()
export class ReportOutput extends CoreOutput {
  @Field(() => Report, { nullable: true })
  report?: Report;
}
