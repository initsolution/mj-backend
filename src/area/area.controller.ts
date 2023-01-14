import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AreaService } from './area.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { Area } from './entities/area.entity';

@Crud({
  model: {
    type: Area
  },

  dto: {
    create: CreateAreaDto,
    update: UpdateAreaDto
  },
  query: {
    join: {

      department: {},
      position : {}

    }
  }
})

@ApiTags('Area')
@Controller('area')
export class AreaController implements CrudController<Area> {
  constructor(public service: AreaService) { }


}
