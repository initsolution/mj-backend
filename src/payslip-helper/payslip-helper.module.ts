import { Module } from '@nestjs/common';
import { PayslipHelperService } from './payslip-helper.service';
import { PayslipHelperController } from './payslip-helper.controller';

@Module({
  controllers: [PayslipHelperController],
  providers: [PayslipHelperService]
})
export class PayslipHelperModule {}
