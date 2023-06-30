import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, UseGuards, Request } from '@nestjs/common';
import { LoansService } from './loans.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { Loan } from './entities/loan.entity';
import { Crud, CrudController, CrudRequest, Override, ParsedBody, ParsedRequest } from '@nestjsx/crud';
import { LessThanOrEqual } from 'typeorm';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from 'src/user/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { JwtAuthGuard } from 'src/user/auth/jwt-auth.guard';

@Crud({
  model : {
    type : Loan
  },
  dto : 
  {
    create : CreateLoanDto,
    update : UpdateLoanDto
  },
  query : {
    join : {
      employee : {
        eager : true
      }
    }
  }
})

@ApiTags('Loans')
@Controller('loans')
export class LoansController implements CrudController <Loan> {
  constructor(public service: LoansService) {}

  @Override()
  async createOne(
    @ParsedRequest() req : CrudRequest,
    @ParsedBody() dto : CreateLoanDto
  )  {
    return this.service.customCreateOne(req, dto)
  }
  @Get('/totaLoanByDepartment/:role')
  // @UseGuards(AuthGuard('jwt'))
  // @UseGuards(JwtAuthGuard)
  async getTotaLoanByDepartment(@Param('role') role : string){
    try {
      // console.log(req.user)
      // const role = req.user.role
      // console.log(role)
      return await this.service.getTotaLoanByDepartment(role);
    } catch (error) {
      throw new HttpException(
        error.message || error.response || JSON.stringify(error),
        error.statusCode || error.status || 500,
      )
    }
  }
  
}
