import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LoansService } from './loans.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { Loan } from './entities/loan.entity';
import { Crud, CrudController, CrudRequest, Override, ParsedBody, ParsedRequest } from '@nestjsx/crud';
import { LessThanOrEqual } from 'typeorm';
import { ApiTags } from '@nestjs/swagger';

@Crud({
  model : {
    type : Loan
  },
  dto : 
  {
    create : CreateLoanDto,
    update : UpdateLoanDto
  },
  query : {
    join : {
      employee : {
        eager : true
      }
    }
  }
})

@ApiTags('Loans')
@Controller('loans')
export class LoansController implements CrudController <Loan> {
  constructor(public service: LoansService) {}

  @Override()
  async createOne(
    @ParsedRequest() req : CrudRequest,
    @ParsedBody() dto : CreateLoanDto
  )  {
    return this.service.customCreateOne(req, dto)
  }
}
