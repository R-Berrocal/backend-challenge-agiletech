import { CreateReportInput } from './create-report.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateReportInput extends PartialType(CreateReportInput) {
  @Field(() => ID)
  id: string;
}
