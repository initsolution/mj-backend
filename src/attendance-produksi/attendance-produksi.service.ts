import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { CreateAttendanceProduksiDto } from './dto/create-attendance-produksi.dto';
import { UpdateAttendanceProduksiDto } from './dto/update-attendance-produksi.dto';
import { AttendanceProduksi } from './entities/attendance-produksi.entity';

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
  
  
}
