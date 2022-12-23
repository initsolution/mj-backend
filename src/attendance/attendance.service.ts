import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Attendance } from './entities/attendance.entity';

@Injectable()
export class AttendanceService extends TypeOrmCrudService<Attendance> {
  constructor(@InjectRepository(Attendance) repo){
    super(repo)
  }
  
  
  async delateAll(){
    return await  this.repo.query(`DELETE FROM Attendance;`);
    
  }
  
  // async customCreateMany(data : any)  {
  //   console.log(data)
  //   const create = await this.repo.create(data)
  //   return await this.repo.save(create)
  // }
  
  
}
