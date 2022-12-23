import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShiftService } from './shift.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { Shift } from './entities/shift.entity';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';

@Crud({
  model : {
    type : Shift
  },
  query : {
    join : {
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
}
