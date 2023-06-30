import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { PayslipProduksiService } from './payslip-produksi.service';
import { CreatePayslipProduksiDto } from './dto/create-payslip-produksi.dto';
import { UpdatePayslipProduksiDto } from './dto/update-payslip-produksi.dto';
import { Crud, CrudController, CrudRequest, Override, ParsedBody, ParsedRequest } from '@nestjsx/crud';
import { PayslipProduksi } from './entities/payslip-produksi.entity';
import { ApiTags } from '@nestjs/swagger';
import { UpdatePayslipProduksiWithBonDto } from './dto/update-payslip-produksi-with-bon.dto';
import { UpdatePayslipProduksiPotonganDto } from './dto/update-payslip-produksi-potongan.dto';

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

  @Delete('deleteByRangeDate/:periode_start/:periode_end')
  async deleteByRangeDate(
    @Param('periode_start') periode_start : string,
    @Param('periode_end') periode_end : string,
  ) {
    return this.service.deleteByRangeDate(periode_start, periode_end)
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
  
  @Get('getTotalPengeluaran/:bulan')
  async getTotalPengeluaran(@Param('bulan') bulan : string){
    return this.service.getTotalPengeluaran(bulan)
  }
  
  @Get('getDetailPengeluaran/:periode_awal/:periode_akhir')
  async getDetailPengeluaran(@Param('periode_awal') periode_awal : string, @Param('periode_akhir') periode_akhir : string){
    return this.service.getDetailPengeluaran(periode_awal, periode_akhir)
  }
  
  @Patch('updatePayslipWithPotonganLain')
  async updatePayslipWithPotonganLain(@Body() dto: UpdatePayslipProduksiPotonganDto, @ParsedRequest() req: CrudRequest) {
    return this.service.inputPotongan(dto, req)
  }
  @Get('cancelPotonganBon/:idPayslip/:employeeId')
  async cancelPotonganBon(@Param('idPayslip') idPayslip : number, @Param('employeeId') employeeId: string){
    return this.service.cancelPotonganBon(idPayslip, employeeId)
  }

}
