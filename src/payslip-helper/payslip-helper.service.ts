import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePayslipHelperDto } from './dto/create-payslip-helper.dto';
import { UpdatePayslipHelperDto } from './dto/update-payslip-helper.dto';
import { PayslipHelper } from './entities/payslip-helper.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { AttendanceHelper } from 'src/attendance-helper/entities/attendance-helper.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeService } from 'src/employee/employee.service';
import { Loan } from 'src/loans/entities/loan.entity';
import { LoansService } from 'src/loans/loans.service';
import { Repository } from 'typeorm';
import * as moment from 'moment'
import { CrudRequest } from '@nestjsx/crud';
import { Employee } from 'src/employee/entities/employee.entity';
import { hitungPotongan } from 'src/function';
import { CreateLoanDto } from 'src/loans/dto/create-loan.dto';
import { UpdatePayslipHelperWithBonDto } from './dto/update-payslip-helper-wih-bon.dto';

@Injectable()
export class PayslipHelperService extends TypeOrmCrudService<PayslipHelper>  {
  constructor(@InjectRepository(PayslipHelper) repo,
    private readonly employeeService: EmployeeService,
    @InjectRepository(AttendanceHelper)
    private readonly attendanceHelperRepo: Repository<AttendanceHelper>,
    @InjectRepository(Loan)
    
    private readonly loanService: LoansService,
  ) {
    super(repo)
  }
  
  async customCreateOne(req ?: CrudRequest, dto?: CreatePayslipHelperDto) {
    let cekNullAtt = 0
    let nameNull =''
    // console.log(dto)
    const employee: Employee[] = await this.employeeService.find({
      where: {
        active: 1,
        department: {
          name: dto.departemen
        }
      },
      relations: ['department', 'loan']
    })
    const payslipHelper: PayslipHelper[] = await this.repo.find({
      where: {
        periode_start: new Date(dto.periode_start).toISOString(),
        periode_end: new Date(dto.periode_end).toISOString(),
        employee: {
          department: {
            name: dto.departemen
          }
        }
      },
      relations: ['employee', 'employee.department', 'employee.area', 'employee.position'],
      order: {
        employee : {
          name : 'ASC'
        }
      },
    })

    // console.log(payslipProd.length)
    // console.log(employee.length)
    if (payslipHelper.length > 0) {
      return payslipHelper
    } else {
      let insertPayslip = []
      for (var i = 0; i < employee.length; i++) {
        const emp = employee[i]
        const total_hari_kerja = 7

        let attendance =
          await this.attendanceHelperRepo.createQueryBuilder('attendancehelper')
            .addSelect(`DATE(attendance_date)`, 'attendance_date')
            .addSelect('time_check_in')
            .addSelect('time_check_out')
            .addSelect('time_start_for_break')
            .addSelect('time_end_for_break')
            .addSelect('time_start_for_left')
            .addSelect('time_end_for_left')
            .addSelect('work_duration')
            .addSelect('total_leave')
            .where(`employeeId = :employee_id AND DATE(attendance_date) BETWEEN DATE(:periode_start) AND DATE(:periode_end)`, {
              employee_id: emp.id,
              periode_start: dto.periode_start,
              periode_end: dto.periode_end
            })
            .orderBy('attendance_date', 'ASC')
            .getMany()

        // console.log(attendance)
        if (attendance.length > 0) {

          // console.log(dto.day_off)
          const total_hari_masuk = attendance.filter(function (att) {
            return (att.time_check_in != null && att.time_check_out != null && !dto.day_off.includes(new Date(att.attendance_date)))
          }).length
          const total_hari_libur = (dto.day_off.length)
          const total_hari_off = total_hari_kerja - total_hari_masuk - total_hari_libur
          const now = moment()
          const active_date = moment(emp.active_date)
          const lama_kerja = now.diff(active_date, 'years')
          // dept 1(produksi), 3(helper)
          const gaji_pokok = emp.gaji_pokok
          const bonus_lama_kerja = lama_kerja * 50
          const upah_1_hari = gaji_pokok + bonus_lama_kerja
          
          const upah_n_hari = (upah_1_hari * total_hari_masuk) 


          let total_leave = 0

          attendance.forEach((value, idx) => {
            // console.log(value.attendance_date + '-' + value.total_leave)
            if (value.total_leave != null) {
              var leave = value.total_leave.split(',')
              for (var j = 0; j < leave.length; j++) {
                var potonganijintelat = hitungPotongan(parseInt(leave[j]), (upah_1_hari + emp.tunjangan_kehadiran))
                // console.log('potongan ijin telat :' + potonganijintelat)
                total_leave += potonganijintelat
              }
            }

          })
          const extra_full = (total_hari_masuk == total_hari_kerja && total_leave == 0) ? emp.extra_full : 0
          const total_pendapatan = upah_n_hari + extra_full 

          const potongan_terlambat_ijin = total_leave
          const potongan_bpjs_tk = emp.iuran_bpjs_tk
          const potongan_bpjs_ks = emp.iuran_bpjs_ks
          const potongan_spsi = emp.iuran_spsi
          let potongan_bon = 0

          const potongan_lain = 0
          const total_potongan = potongan_terlambat_ijin + potongan_bpjs_tk + potongan_bpjs_ks + potongan_spsi + potongan_bon + potongan_lain

          const pendapatan_gaji = total_pendapatan - total_potongan
          let sisa_bon = 0
          if (emp.loan.length > 0) {
            const loan = emp.loan.sort((a, b) => {
              let da = new Date(a.created_at)
              let db = new Date(b.created_at)
              return db.getTime() - da.getTime()
            })
            sisa_bon = loan[0].total_loan_current
          }
          const inputData =
          {
            employee: emp,
            periode_start: dto.periode_start, periode_end: dto.periode_end,
            total_hari_kerja, total_hari_masuk, total_hari_off, total_hari_libur,
            lama_kerja, gaji_pokok, bonus_lama_kerja, upah_1_hari, 
            upah_n_hari, extra_full, total_pendapatan,
            potongan_terlambat_ijin, potongan_bpjs_tk, potongan_bpjs_ks, potongan_spsi,
            potongan_bon, potongan_lain, total_potongan,
            pendapatan_gaji, sisa_bon
          }

          // console.log(inputData)

          insertPayslip.push(inputData)

        }
        else {
          cekNullAtt++
          nameNull += 'id '+ emp.id +' nama '+emp.name +'\n'
        }
      }

      if (cekNullAtt == 0) {
        const savePayslip = await this.repo.create(insertPayslip)
        return await this.repo.save(savePayslip)
      } else {
        throw new HttpException('Not found '+nameNull, HttpStatus.NOT_FOUND);
      }



    }

  }
  
  async inputBon(dto: UpdatePayslipHelperWithBonDto, req: CrudRequest) {
    const loanDto: CreateLoanDto = {
      type: dto.type,
      employee: dto.employee,
      note: dto.note,
      nominal: dto.nominal
    }
    const loan = await this.loanService.customCreateOne(req, loanDto)
    const payslipNow = await this.repo.findOne({
      where: {
        id: dto.idPayslip
      }
    })
    const total_potongan = parseInt(payslipNow.total_potongan+'') + parseInt(dto.nominal+'')
    const updateBonPayslip = {
      potongan_bon: dto.nominal,
      sisa_bon: loan.total_loan_current,
      total_potongan: total_potongan,
      pendapatan_gaji : payslipNow.total_pendapatan - total_potongan
      
    }
    console.log(dto.idPayslip)
    await this.repo.update(dto.idPayslip, updateBonPayslip)
    const payslip: PayslipHelper[] = await this.repo.find({
      where: {
        periode_start: dto.periode_start,
        periode_end: dto.periode_end,
        employee: {
          department: {
            name: dto.departemen
          }
        }
      },
      relations: ['employee', 'employee.department']
    })
    return payslip
  }
  
}
