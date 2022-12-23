import { Injectable } from '@nestjs/common';
import { CreatePayslipBulananDto } from './dto/create-payslip-bulanan.dto';
import { UpdatePayslipBulananDto } from './dto/update-payslip-bulanan.dto';

@Injectable()
export class PayslipBulananService {
  create(createPayslipBulananDto: CreatePayslipBulananDto) {
    return 'This action adds a new payslipBulanan';
  }

  findAll() {
    return `This action returns all payslipBulanan`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payslipBulanan`;
  }

  update(id: number, updatePayslipBulananDto: UpdatePayslipBulananDto) {
    return `This action updates a #${id} payslipBulanan`;
  }

  remove(id: number) {
    return `This action removes a #${id} payslipBulanan`;
  }
}
