import { Injectable } from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Area } from './entities/area.entity';

@Injectable()
export class AreaService extends TypeOrmCrudService<Area> {
  constructor(@InjectRepository(Area) repo){
    super(repo)
  }
  
}
