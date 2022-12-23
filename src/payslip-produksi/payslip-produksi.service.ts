import { Injectable } from '@nestjs/common';
import { CreatePayslipProduksiDto } from './dto/create-payslip-produksi.dto';
import { UpdatePayslipProduksiDto } from './dto/update-payslip-produksi.dto';

@Injectable()
export class PayslipProduksiService {
  create(createPayslipProduksiDto: CreatePayslipProduksiDto) {
    return 'This action adds a new payslipProduksi';
  }

  findAll() {
    return `This action returns all payslipProduksi`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payslipProduksi`;
  }

  update(id: number, updatePayslipProduksiDto: UpdatePayslipProduksiDto) {
    return `This action updates a #${id} payslipProduksi`;
  }

  remove(id: number) {
    return `This action removes a #${id} payslipProduksi`;
  }
}
