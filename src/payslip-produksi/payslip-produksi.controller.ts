import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { PayslipProduksiService } from './payslip-produksi.service';
import { CreatePayslipProduksiDto } from './dto/create-payslip-produksi.dto';
import { UpdatePayslipProduksiDto } from './dto/update-payslip-produksi.dto';
import { Crud, CrudController, CrudRequest, Override, ParsedBody, ParsedRequest } from '@nestjsx/crud';
import { PayslipProduksi } from './entities/payslip-produksi.entity';
import { ApiTags } from '@nestjs/swagger';
import { UpdatePayslipProduksiWithBonDto } from './dto/update-payslip-produksi-with-bon.dto';

@Crud({
  model: {
    type: PayslipProduksi
  },
  dto:
  {
    create: CreatePayslipProduksiDto,
    update: UpdatePayslipProduksiDto
  }
})

@ApiTags('PayslipProduksi')
@Controller('payslip-produksi')
export class PayslipProduksiController implements CrudController<PayslipProduksi> {
  constructor(public service: PayslipProduksiService,


  ) { }

  get base(): CrudController<PayslipProduksi> {
    return this
  }

  @Override()
  async createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreatePayslipProduksiDto
  ) {
    // console.log(dto)
    return this.service.customCreateOne(req, dto)
  }

  @Patch('updatePayslipWithBon')
  async updatePayslipWithBon(@Body() dto: UpdatePayslipProduksiWithBonDto, @ParsedRequest() req: CrudRequest) {
    return this.service.inputBon(dto, req)
  }

}
