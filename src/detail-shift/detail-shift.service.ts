import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { DetailShift } from './entities/detail-shift.entity';

@Injectable()
export class DetailShiftService extends TypeOrmCrudService<DetailShift>{
  constructor(@InjectRepository(DetailShift) repo){
    super(repo)
  }
}
