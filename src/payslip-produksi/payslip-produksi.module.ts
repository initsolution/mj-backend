import { Module } from '@nestjs/common';
import { PayslipProduksiService } from './payslip-produksi.service';
import { PayslipProduksiController } from './payslip-produksi.controller';

@Module({
  controllers: [PayslipProduksiController],
  providers: [PayslipProduksiService]
})
export class PayslipProduksiModule {}
