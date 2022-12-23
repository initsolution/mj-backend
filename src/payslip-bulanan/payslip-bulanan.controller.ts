import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PayslipBulananService } from './payslip-bulanan.service';
import { CreatePayslipBulananDto } from './dto/create-payslip-bulanan.dto';
import { UpdatePayslipBulananDto } from './dto/update-payslip-bulanan.dto';

@Controller('payslip-bulanan')
export class PayslipBulananController {
  constructor(private readonly payslipBulananService: PayslipBulananService) {}

  @Post()
  create(@Body() createPayslipBulananDto: CreatePayslipBulananDto) {
    return this.payslipBulananService.create(createPayslipBulananDto);
  }

  @Get()
  findAll() {
    return this.payslipBulananService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.payslipBulananService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePayslipBulananDto: UpdatePayslipBulananDto) {
    return this.payslipBulananService.update(+id, updatePayslipBulananDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.payslipBulananService.remove(+id);
  }
}
