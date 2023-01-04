import { Controller} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Crud, CrudController } from '@nestjsx/crud'
import { Employee } from './entities/employee.entity';
import { ApiTags } from '@nestjs/swagger';

@Crud({
  model : {
    type : Employee
  },
  params: {
    id: {
      field: 'id',
      type: 'string',
      primary: true,
    },
  },
  dto : {
    create : CreateEmployeeDto,
    update : UpdateEmployeeDto
  },
  query : {
    join : {
      attendance : {},
      department : {},
      shift : {},
      'shift.detailShift' : {},
      loan : {eager : false}
    }
  }
})

@ApiTags('Employee')
@Controller('employee')
export class EmployeeController implements CrudController<Employee> {
  constructor(public service: EmployeeService) {}

  
}
