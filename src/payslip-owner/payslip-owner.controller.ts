import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PayslipOwnerService } from './payslip-owner.service';
import { CreatePayslipOwnerDto } from './dto/create-payslip-owner.dto';
import { UpdatePayslipOwnerDto } from './dto/update-payslip-owner.dto';
import { PayslipOwner } from './entities/payslip-owner.entity';
import { Crud, CrudController, CrudRequest, Override, ParsedBody, ParsedRequest } from '@nestjsx/crud';
import { ApiTags } from '@nestjs/swagger';
import { UpdatePayslipOwnerWithBonDto } from './dto/update-payslip-owner-bon.dto';
import { UpdatePayslipOwnerTotalHariMasuk } from './dto/update-payslip-owner-total-hari-kerja.dto';

@Crud({
  model: {
    type: PayslipOwner
  },
  dto:
  {
    create: CreatePayslipOwnerDto,
    update: UpdatePayslipOwnerDto
  }
})
@ApiTags('PayslipOwner')
@Controller('payslip-owner')
export class PayslipOwnerController implements CrudController<PayslipOwner> {
  constructor(public service: PayslipOwnerService) {}
  get base(): CrudController<PayslipOwner> {
    return this
  }
  
  @Override()
  async createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreatePayslipOwnerDto
  ) {

    return this.service.customCreateOne(req, dto)
  }
  
  @Patch('updatePayslipWithBon')
  async updatePayslipWithBon(@Body() dto: UpdatePayslipOwnerWithBonDto, @ParsedRequest() req: CrudRequest) {
    return this.service.inputBon(dto, req)
  }
  
  @Patch('updatePayslipTotalHariMasuk')
  async updatePayslipTotalHariMasuk(@Body() dto: UpdatePayslipOwnerTotalHariMasuk, @ParsedRequest() req: CrudRequest) {
    return this.service.changeTotalHariMasukKerja(dto)
  }
  
}
