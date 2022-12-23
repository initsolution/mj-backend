import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PayslipProduksiService } from './payslip-produksi.service';
import { CreatePayslipProduksiDto } from './dto/create-payslip-produksi.dto';
import { UpdatePayslipProduksiDto } from './dto/update-payslip-produksi.dto';

@Controller('payslip-produksi')
export class PayslipProduksiController {
  constructor(private readonly payslipProduksiService: PayslipProduksiService) {}

  @Post()
  create(@Body() createPayslipProduksiDto: CreatePayslipProduksiDto) {
    return this.payslipProduksiService.create(createPayslipProduksiDto);
  }

  @Get()
  findAll() {
    return this.payslipProduksiService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.payslipProduksiService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePayslipProduksiDto: UpdatePayslipProduksiDto) {
    return this.payslipProduksiService.update(+id, updatePayslipProduksiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.payslipProduksiService.remove(+id);
  }
}
