import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Like } from 'typeorm';
import { Employee } from './entities/employee.entity';
import * as moment from 'moment';

@Injectable()
export class EmployeeService extends TypeOrmCrudService<Employee> {
  constructor(@InjectRepository(Employee) repo) {
    super(repo);
  }

  async getAllBirthdayEmployee(): Promise<any> {
    var dateNow = moment().format('mm-dd');
    const employee: Employee[] = await this.repo.find({
      where : {
        date_of_birth: Like('%'+dateNow),
      }
    });
    console.log(dateNow);
    return employee;
  }
}
