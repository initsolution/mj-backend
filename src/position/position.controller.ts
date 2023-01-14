import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PositionService } from './position.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { Position } from './entities/position.entity';

@Crud({
  model: {
    type: Position
  },

  dto: {
    create: CreatePositionDto,
    update: UpdatePositionDto
  },
  query: {
    join: {

      area: {},

    }
  }
})

@ApiTags('Position')
@Controller('position')
export class PositionController implements CrudController<Position> {
  constructor(public service: PositionService) {}

  
}
