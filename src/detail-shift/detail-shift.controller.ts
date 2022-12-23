import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { DetailShiftService } from './detail-shift.service';
import { CreateDetailShiftDto } from './dto/create-detail-shift.dto';
import { UpdateDetailShiftDto } from './dto/update-detail-shift.dto';
import { DetailShift } from './entities/detail-shift.entity';

@Crud({
  model : {
    type : DetailShift
  },
  
  dto : {
    create : CreateDetailShiftDto,
    update : UpdateDetailShiftDto
  },
})
@ApiTags('Detail Shift')
@Controller('detail-shift')
export class DetailShiftController implements CrudController<DetailShift> {
  constructor(public service: DetailShiftService) {}

}
