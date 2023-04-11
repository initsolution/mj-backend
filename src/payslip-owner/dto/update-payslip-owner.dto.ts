import { PartialType } from '@nestjs/swagger';
import { CreatePayslipOwnerDto } from './create-payslip-owner.dto';

export class UpdatePayslipOwnerDto extends PartialType(CreatePayslipOwnerDto) {}
