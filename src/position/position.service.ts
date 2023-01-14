import { Injectable } from '@nestjs/common';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Position } from './entities/position.entity';

@Injectable()
export class PositionService extends TypeOrmCrudService<Position> {
  constructor(@InjectRepository(Position) repo){
    super(repo)
  }
  
  
}
