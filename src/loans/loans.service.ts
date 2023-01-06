import { Injectable } from '@nestjs/common';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { Loan } from './entities/loan.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest } from '@nestjsx/crud';
import { Employee } from 'src/employee/entities/employee.entity';

@Injectable()
export class LoansService extends TypeOrmCrudService<Loan> {
  constructor(@InjectRepository(Loan) repo,) {

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
          dto.total_loan_current = loan.total_loan_current + parseInt(dto.nominal+'')
        } else if (dto.type == 'bayar') {
          dto.total_loan_current = loan.total_loan_current - parseInt(dto.nominal+'')
          dto.total_pay_current = loan.total_pay_current + parseInt(dto.nominal+'')
        }
      }else{
        dto.total_loan_current = dto.nominal
      }

    }
    const createLoan = await this.repo.create(dto)
    return await this.repo.save(createLoan)
  }
}
