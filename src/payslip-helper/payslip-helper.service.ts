import { Injectable } from '@nestjs/common';
import { CreatePayslipHelperDto } from './dto/create-payslip-helper.dto';
import { UpdatePayslipHelperDto } from './dto/update-payslip-helper.dto';

@Injectable()
export class PayslipHelperService {
  create(createPayslipHelperDto: CreatePayslipHelperDto) {
    return 'This action adds a new payslipHelper';
  }

  findAll() {
    return `This action returns all payslipHelper`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payslipHelper`;
  }

  update(id: number, updatePayslipHelperDto: UpdatePayslipHelperDto) {
    return `This action updates a #${id} payslipHelper`;
  }

  remove(id: number) {
    return `This action removes a #${id} payslipHelper`;
  }
}
