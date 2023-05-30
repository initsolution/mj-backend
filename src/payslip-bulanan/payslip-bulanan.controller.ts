import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PayslipBulananService } from './payslip-bulanan.service';
import { CreatePayslipBulananDto } from './dto/create-payslip-bulanan.dto';
import { UpdatePayslipBulananDto } from './dto/update-payslip-bulanan.dto';
import { PayslipBulanan } from './entities/payslip-bulanan.entity';
import { Crud, CrudController, CrudRequest, Override, ParsedBody, ParsedRequest } from '@nestjsx/crud';
import * as moment from 'moment'
import { UpdatePayslipBulananPotonganDto } from './dto/update-payslip-bulanan-potongan.dto';
import { UpdatePayslipBulananTambahanLainDto } from './dto/update-payslip-bulanan-tambahan-lain.dto';
import { UpdatePayslipBulananWithBonDto } from './dto/update-payslip-bulanan-with-bon.dto';
import { ApiTags } from '@nestjs/swagger';

@Crud({
  model: {
    type: PayslipBulanan
  },
  dto:
  {
    create: CreatePayslipBulananDto,
    update: UpdatePayslipBulananDto
  }
})

@ApiTags('PayslipBulanan')
@Controller('payslip-bulanan')
export class PayslipBulananController implements CrudController<PayslipBulanan> {
  constructor(public service: PayslipBulananService) { }
  get base(): CrudController<PayslipBulanan> {
    return this
  }
  @Override()
  async createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreatePayslipBulananDto
  ) {

    return this.service.customCreateOne(req, dto)
  }

  @Delete('deleteByRangeDate/:periode_start/:periode_end')
  async deleteByRangeDate(
    @Param('periode_start') periode_start : string,
    @Param('periode_end') periode_end : string,
  ) {
    return this.service.deleteByRangeDate(periode_start, periode_end)
  }
  
  @Patch('updatePayslipWithBon')
  async updatePayslipWithBon(@Body() dto: UpdatePayslipBulananWithBonDto, @ParsedRequest() req: CrudRequest) {
    return this.service.inputBon(dto, req)
  }
  
  @Get('getTotalPengeluaranBulanan/:bulan/:subdept')
  async getTotalPengeluaranBulanan(@Param('bulan') bulan : string, @Param('subdept') subDept : string){
    return this.service.getTotalPengeluaran(bulan, subDept)
  }
  
  @Get('getDetailPengeluaranBulanan/:periode_awal/:periode_akhir/:subdept')
  async getDetailPengeluaran(@Param('periode_awal') periode_awal : string, 
  @Param('periode_akhir') periode_akhir : string,
  @Param('subdept') subDept : string){
    return this.service.getDetailPengeluaran(periode_awal, periode_akhir, subDept)
  }
  
  @Patch('updatePayslipWithPotonganLain')
  async updatePayslipWithPotonganLain(@Body() dto: UpdatePayslipBulananPotonganDto, @ParsedRequest() req: CrudRequest) {
    return this.service.inputPotongan(dto, req)
  }
  
  @Patch('updatePayslipTambahanlain')
  async updatePayslipTambahanDriver(@Body() dto: UpdatePayslipBulananTambahanLainDto, @ParsedRequest() req: CrudRequest) {
    return this.service.inputTambahanLain(dto, req)
  }
}
