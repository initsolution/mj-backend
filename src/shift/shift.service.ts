import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Shift } from './entities/shift.entity';

@Injectable()
export class ShiftService extends TypeOrmCrudService<Shift>{
  constructor(@InjectRepository(Shift) repo){
    super(repo)
  }
}
