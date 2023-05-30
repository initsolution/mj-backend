import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { CreateAttendanceProduksiDto } from './dto/create-attendance-produksi.dto';
import { UpdateAttendanceProduksiDto } from './dto/update-attendance-produksi.dto';
import { AttendanceProduksi } from './entities/attendance-produksi.entity';
import * as moment from 'moment';

@Injectable()
export class AttendanceProduksiService extends TypeOrmCrudService<AttendanceProduksi> {
  constructor(@InjectRepository(AttendanceProduksi) repo){
    super(repo)
  }
  
  
  // async delateAll(){
  //   return await  this.repo.query(`DELETE FROM Attendance;`);
    
  // }

  async deleteByRangeDate(start_date, end_date){
    return await this.repo.createQueryBuilder('AttendanceProduksi')
      .delete()
      .where('attendance_date BETWEEN :start_date AND :end_date', {
        start_date : start_date,
        end_date : end_date
      }).execute()
    
  }
  
  // async customCreateMany(data : any)  {
  //   console.log(data)
  //   const create = await this.repo.create(data)
  //   return await this.repo.save(create)
  // }
  
  async getCustomAttendance(): Promise<any>{
    try {
      const dateNow = moment(new Date())
      // .add(-1, 'days')
      .format("YYYY-MM-DD");
      let queryBuilder: any = await 
        this.repo.createQueryBuilder('AttendanceProduksi')
        .leftJoinAndSelect('AttendanceProduksi.employee', 'employee')
        .where('(DATE(AttendanceProduksi.created_at) = :now)',{now : dateNow})
        // .where('DATE(AttendanceProduksi.created_at) = '+dateNow)
        .orderBy(`employee.name`, `ASC`)
        .addOrderBy('AttendanceProduksi.attendance_date', 'ASC')
      return await queryBuilder.getMany()
    } catch (error) {
      return Promise.reject(error);
    }
  }
  
  async checkForDuplicate(employeeId: string, attendance_date: string): Promise<AttendanceProduksi[]>{
    try {
      return this.repo.find({where : {
        employee : {
          id : employeeId
        },
        attendance_date : attendance_date
      }})
    } catch (error) {
      return Promise.reject(error);
    }
  }
  
}
