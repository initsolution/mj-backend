import { Module } from '@nestjs/common';
import { PayslipOwnerService } from './payslip-owner.service';
import { PayslipOwnerController } from './payslip-owner.controller';

@Module({
  controllers: [PayslipOwnerController],
  providers: [PayslipOwnerService]
})
export class PayslipOwnerModule {}
