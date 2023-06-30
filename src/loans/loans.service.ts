import { Injectable } from '@nestjs/common';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { Loan } from './entities/loan.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest } from '@nestjsx/crud';
import { Employee } from 'src/employee/entities/employee.entity';
import { EntityManager, Repository, getManager } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class LoansService extends TypeOrmCrudService<Loan> {
  constructor(@InjectRepository(Loan) repo,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {

    super(repo)
  }

  async customCreateOne(req: CrudRequest, dto: CreateLoanDto) {
    // console.log(dto)
    const loan = await this.repo.findOne(
      {
        where: {
          employee: {
            id: dto.employee.id
          }
        },
        order: {
          created_at: 'DESC'
        },
        relations: ['employee']
      }
    )
    // console.log(loan)
    if (loan == null) {
      if (dto.type == 'pinjam') {
        dto.total_loan_current = dto.nominal
      }
    } else {
      if (loan.total_loan_current != 0) {
        dto.total_loan_before = loan.total_loan_current
        dto.total_pay_before = loan.total_pay_current
        if (dto.type == 'pinjam') {
          dto.total_loan_current = loan.total_loan_current + parseInt(dto.nominal + '')
        } else if (dto.type == 'bayar') {
          dto.total_loan_current = loan.total_loan_current - parseInt(dto.nominal + '')
          dto.total_pay_current = loan.total_pay_current + parseInt(dto.nominal + '')
        }
      } else {
        dto.total_loan_current = dto.nominal
      }

    }
    const createLoan = await this.repo.create(dto)
    return await this.repo.save(createLoan)
  }
  async customDeleteBon(nominal : number, employeeId : string){
    return await this.repo.createQueryBuilder('Loan')
      .delete()
      .where('nominal = :nominal AND employeeId = :employeeId', {
        nominal : nominal,
        employeeId : employeeId
      }).execute()
  } 

  async getTotaLoanByDepartment(role): Promise<any> {
    // console.log('service : ' + role)
    try {
      let dataOwner = []
      let dataNoOwner =[]
      const queryBuilder = this.employeeRepository.createQueryBuilder('employee')

      const realQuery =  queryBuilder
        .select('sum((' +
          queryBuilder.subQuery()
            .select('loan.total_loan_current')
            .from(Loan, 'loan')
            .where('loan.employeeId = employee.id')
            .orderBy('loan.created_at', 'DESC')
            .limit(1)
            .getQuery() +
          '))', 'total_loan'
        )
        .addSelect('department.name')
        .leftJoin('employee.department', 'department')
        .groupBy('department.name')
        .where('employee.type != :name', { name: 'KHUSUS' })
        dataNoOwner = await realQuery.getRawMany()
        
      if (role != 'owner') {
        
        return dataNoOwner
      }
      else {
        const queryBuilderOwner = this.employeeRepository.createQueryBuilder('employee')
        const queryOwner =  queryBuilderOwner
          .select('sum((' +
          queryBuilderOwner.subQuery()
              .select('loan.total_loan_current')
              .from(Loan, 'loan')
              .where('loan.employeeId = employee.id')
              .orderBy('loan.created_at', 'DESC')
              .limit(1)
              .getQuery() +
            '))', 'total_loan'
          )
          .addSelect('employee.type', 'department_name')
          .addSelect('department.id')
          .leftJoin('employee.department', 'department')
          .groupBy('department.id')
          .where('employee.type = :name', { name: 'KHUSUS' })
        dataOwner = await queryOwner.getRawMany()
        let dataUnion = []
        for(const data of dataNoOwner){
          // console.log(data)
          const dt = {
            'department_name' : data.department_name,
            'total_loan' : data.total_loan
          }
          dataUnion.push(dt)
        }
        for(const data of dataOwner){
          // console.log(data)
          const dt = {
            'department_name' : data.department_name,
            'total_loan' : data.total_loan
          }
          dataUnion.push(dt)
        }
        
        
        return dataUnion
      }

    } catch (error) {
      return Promise.reject(error);
    }
  }
}
