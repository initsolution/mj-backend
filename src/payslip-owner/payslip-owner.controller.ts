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
  
  @Get('getDetailPengeluaran/:periode_awal/:periode_akhir')
  async getDetailPengeluaran(@Param('periode_awal') periode_awal : string, @Param('periode_akhir') periode_akhir : string){
    return this.service.getDetailPengeluaran(periode_awal, periode_akhir)
  }
  @Get('getTotalPengeluaran/:bulan')
  async getTotalPengeluaran(@Param('bulan') bulan : string){
    return this.service.getTotalPengeluaran(bulan)
  }
  
  @Get('cancelPotonganBon/:idPayslip/:employeeId')
  async cancelPotonganBon(@Param('idPayslip') idPayslip : number, @Param('employeeId') employeeId: string){
    return this.service.cancelPotonganBon(idPayslip, employeeId)
  }
}
