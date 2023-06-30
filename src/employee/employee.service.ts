import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Like } from 'typeorm';
import { Employee } from './entities/employee.entity';
import * as moment from 'moment';
import { BulkCreateEmployeeDto } from './dto/create-employee.dto';
import { DepartmentService } from 'src/department/department.service';
import { PositionService } from 'src/position/position.service';
import { AreaService } from 'src/area/area.service';
import { ShiftService } from 'src/shift/shift.service';
import { Department } from 'src/department/entities/department.entity';
import { Area } from 'src/area/entities/area.entity';
import { Position } from 'src/position/entities/position.entity';
import { Shift } from 'src/shift/entities/shift.entity';

@Injectable()
export class EmployeeService extends TypeOrmCrudService<Employee> {
  constructor(@InjectRepository(Employee) repo,
  private readonly departmentService: DepartmentService,
  private readonly positionService: PositionService,
  private readonly areaService: AreaService,
  private readonly shiftService: ShiftService,

  
  
  ) {
    super(repo);
  }

  async getAllBirthdayEmployee(): Promise<any> {
    var dateNow = moment().format('mm-dd');
    const employee: Employee[] = await this.repo.find({
      where : {
        date_of_birth: Like('%'+dateNow),
      }
    });
    // console.log(dateNow);
    return employee;
  }
  
  async customCreateAll(dto : BulkCreateEmployeeDto): Promise<any>{
    
    for(var i=0 ; i<dto.bulk.length; i++){
      var emp = dto.bulk[i]
      const department : Department = await this.departmentService.findOne({
        where : {
          name : emp.department.name
        }
      })
      const area :Area = await this.areaService.findOne({
        where : {
          name : emp.area.name
        }
      })
      const position :Position = await this.positionService.findOne({
        where : {
          name : emp.position.name
        }
      })
      const shift: Shift = await this.shiftService.findOne({
        where : {
          name : emp.shift.name
        }
      })
      emp.department.id = department.id
      emp.area.id = area.id
      emp.position.id = position.id
      emp.shift.id = shift.id
    }
    
    return this.repo.insert(dto.bulk)
    
  }
  
}
