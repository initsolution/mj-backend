import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShiftService } from './shift.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { Shift } from './entities/shift.entity';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudRequest, ParsedRequest } from '@nestjsx/crud';
import { CreateShiftDetailDTO } from './dto/create-shift-detail.dto';

@Crud({
  model : {
    type : Shift
  },
  query : {
    join : {
      department : {},
      detailShift : {}
    }
  },
  dto : {
    create : CreateShiftDto,
    update : UpdateShiftDto
  },
})

@ApiTags('Shift')
@Controller('shift')
export class ShiftController implements CrudController<Shift> {
  constructor(public service: ShiftService) {}
  
  @Post('createShiftDetail')
  createShiftDetail(
    @ParsedRequest()req : CrudRequest, 
    @Body() dto : CreateShiftDetailDTO){
      return this.service.createShiftDetail(req, dto)
    }
}
