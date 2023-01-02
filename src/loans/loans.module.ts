import { Module } from '@nestjs/common';
import { LoansService } from './loans.service';
import { LoansController } from './loans.controller';
import { Loan } from './entities/loan.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeService } from 'src/employee/employee.service';
import { Employee } from 'src/employee/entities/employee.entity';

@Module({
  imports : [TypeOrmModule.forFeature([ Employee, Loan])],
  controllers: [LoansController],
  providers: [LoansService, EmployeeService]
})
export class LoansModule {}
