import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PayslipHelperService } from './payslip-helper.service';
import { CreatePayslipHelperDto } from './dto/create-payslip-helper.dto';
import { UpdatePayslipHelperDto } from './dto/update-payslip-helper.dto';
import { ApiTags } from '@nestjs/swagger';
import { CrudController, Override, ParsedRequest, CrudRequest, ParsedBody, Crud } from '@nestjsx/crud';
import { UpdatePayslipHelperWithBonDto } from './dto/update-payslip-helper-wih-bon.dto';
import { PayslipHelper } from './entities/payslip-helper.entity';
import { UpdatePayslipHelperPotonganDto } from './dto/update-payslip-heper-potonganlain.dto';

@Crud({
  model: {
    type: PayslipHelper
  },
  dto:
  {
    create: CreatePayslipHelperDto,
    update: UpdatePayslipHelperDto
  }
})

@ApiTags('PayslipHelper')
@Controller('payslip-helper')
export class PayslipHelperController implements CrudController<PayslipHelper> {
  constructor(public service: PayslipHelperService) {}

  get base(): CrudController<PayslipHelper> {
    return this
  }

  @Override()
  async createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreatePayslipHelperDto
  ) {
    // console.log(dto)
    return this.service.customCreateOne(req, dto)
  }
  
  @Patch('updatePayslipWithBon')
  async updatePayslipWithBon(@Body() dto: UpdatePayslipHelperWithBonDto, @ParsedRequest() req: CrudRequest) {
    return this.service.inputBon(dto, req)
  }
  
  @Get('getTotalPengeluaran/:bulan')
  async getTotalPengeluaran(@Param('bulan') bulan : string){
    return this.service.getTotalPengeluaran(bulan)
  }
  
  @Get('getDetailPengeluaran/:periode_awal/:periode_akhir')
  async getDetailPengeluaran(@Param('periode_awal') periode_awal : string, @Param('periode_akhir') periode_akhir : string){
    return this.service.getDetailPengeluaran(periode_awal, periode_akhir)
  }
  
  @Patch('updatePayslipWithPotonganLain')
  async updatePayslipWithPotonganLain(@Body() dto: UpdatePayslipHelperPotonganDto, @ParsedRequest() req: CrudRequest) {
    return this.service.inputPotongan(dto, req)
  }
}
