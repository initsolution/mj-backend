import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PayslipHelperService } from './payslip-helper.service';
import { CreatePayslipHelperDto } from './dto/create-payslip-helper.dto';
import { UpdatePayslipHelperDto } from './dto/update-payslip-helper.dto';

@Controller('payslip-helper')
export class PayslipHelperController {
  constructor(private readonly payslipHelperService: PayslipHelperService) {}

  @Post()
  create(@Body() createPayslipHelperDto: CreatePayslipHelperDto) {
    return this.payslipHelperService.create(createPayslipHelperDto);
  }

  @Get()
  findAll() {
    return this.payslipHelperService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.payslipHelperService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePayslipHelperDto: UpdatePayslipHelperDto) {
    return this.payslipHelperService.update(+id, updatePayslipHelperDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.payslipHelperService.remove(+id);
  }
}
