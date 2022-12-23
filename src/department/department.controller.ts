import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from './entities/department.entity';

@Crud({
  model : {
    type : Department
  },
  
  dto : {
    create : CreateDepartmentDto,
    update : UpdateDepartmentDto
  },
  query : {
    join : {
      employee : {}
    }
  }
})

@ApiTags('Department')
@Controller('department')
export class DepartmentController implements CrudController<Department> {
  constructor(public service: DepartmentService) {}

}
