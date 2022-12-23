import { PartialType } from '@nestjs/swagger';
import { CreatePayslipProduksiDto } from './create-payslip-produksi.dto';

export class UpdatePayslipProduksiDto extends PartialType(CreatePayslipProduksiDto) {}
