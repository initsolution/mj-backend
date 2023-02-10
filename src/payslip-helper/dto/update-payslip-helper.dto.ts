import { PartialType } from '@nestjs/swagger';
import { CreatePayslipHelperDto } from './create-payslip-helper.dto';

export class UpdatePayslipHelperDto extends PartialType(CreatePayslipHelperDto) {}
