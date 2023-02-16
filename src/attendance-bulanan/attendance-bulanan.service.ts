import { Injectable } from '@nestjs/common';
import { CreateAttendanceBulananDto } from './dto/create-attendance-bulanan.dto';
import { UpdateAttendanceBulananDto } from './dto/update-attendance-bulanan.dto';
import { AttendanceBulanan } from './entities/attendance-bulanan.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import * as moment from 'moment';

@Injectable()
export class AttendanceBulananService extends TypeOrmCrudService<AttendanceBulanan> {
  constructor(@InjectRepository(AttendanceBulanan) repo){
    super(repo)
  }
  async getCustomAttendance(): Promise<any>{
    try {
      const dateNow = moment(new Date())
      // .add(-1, 'days')
      .format("YYYY-MM-DD");
      let queryBuilder: any = await 
        this.repo.createQueryBuilder('AttendanceBulanan')
        .leftJoinAndSelect('AttendanceBulanan.employee', 'employee')
        .leftJoinAndSelect('AttendanceBulanan.shift', 'shift')
        .where('(DATE(AttendanceProduksi.created_at) = :now)',{now : dateNow})
        // .where('DATE(AttendanceProduksi.created_at) = '+dateNow)
        .orderBy(`employee.name`, `ASC`)
        .addOrderBy('AttendanceBulanan.attendance_date', 'ASC')
      return await queryBuilder.getMany()
    } catch (error) {
      return Promise.reject(error);
    }
  }
  
  async checkForDuplicate(employeeId: string, attendance_date: string): Promise<AttendanceBulanan[]> {
    try {
      return this.repo.find({
        where: {
          employee: {
            id: employeeId
          },
          attendance_date: attendance_date
        }
      })
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
