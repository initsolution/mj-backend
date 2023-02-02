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
  
}
