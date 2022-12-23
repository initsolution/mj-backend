import { PartialType } from '@nestjs/swagger';
import { CreatePayslipBulananDto } from './create-payslip-bulanan.dto';

export class UpdatePayslipBulananDto extends PartialType(CreatePayslipBulananDto) {}
