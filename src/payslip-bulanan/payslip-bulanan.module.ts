import { Module } from '@nestjs/common';
import { PayslipBulananService } from './payslip-bulanan.service';
import { PayslipBulananController } from './payslip-bulanan.controller';

@Module({
  controllers: [PayslipBulananController],
  providers: [PayslipBulananService]
})
export class PayslipBulananModule {}
