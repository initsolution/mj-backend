import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PayslipOwnerService } from './payslip-owner.service';
import { CreatePayslipOwnerDto } from './dto/create-payslip-owner.dto';
import { UpdatePayslipOwnerDto } from './dto/update-payslip-owner.dto';
import { PayslipOwner } from './entities/payslip-owner.entity';
import { Crud, CrudController } from '@nestjsx/crud';

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

@Controller('payslip-owner')
export class PayslipOwnerController implements CrudController<PayslipOwner> {
  constructor(public service: PayslipOwnerService) {}
  get base(): CrudController<PayslipOwner> {
    return this
  }
  
}
