import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Shift } from './entities/shift.entity';
import { CrudRequest } from '@nestjsx/crud';
import { CreateShiftDetailDTO } from './dto/create-shift-detail.dto';
import { DetailShift } from 'src/detail-shift/entities/detail-shift.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ShiftService extends TypeOrmCrudService<Shift>{
  constructor(@InjectRepository(Shift) repo,
    @InjectRepository(DetailShift)
    private readonly detailShiftRepo: Repository<DetailShift>,
  ) {
    super(repo)
  }

  async createShiftDetail(req: CrudRequest, dto: CreateShiftDetailDTO) {
    const createShift = await this.repo.create({
      name: dto.name,
      switchable: dto.switchable
    })
    const saveShift = await this.repo.save(createShift)

    let dtDetailShift = []

    for (let i = 0; i < dto.shiftDetail.length; i++) {
      let detShift = dto.shiftDetail[i]
      dtDetailShift.push({
        active: detShift.active,
        break_duration_h: detShift.break_duration_h,
        break_duration_m: detShift.break_duration_m,
        break_hours: detShift.break_hours,
        days: detShift.days,
        end: detShift.end,
        end_break: detShift.end_break,
        is_flexible: detShift.is_flexible,
        shift: saveShift,
        start: detShift.start,
        start_break: detShift.start_break,
        work_hours: detShift.work_hours
      })
    }

    

    return await this.detailShiftRepo.save(dtDetailShift)
  }
}
