import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePayslipProduksiDto } from './dto/create-payslip-produksi.dto';
import { UpdatePayslipProduksiDto } from './dto/update-payslip-produksi.dto';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { PayslipProduksi } from './entities/payslip-produksi.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest } from '@nestjsx/crud';
import { AttendanceProduksiService } from 'src/attendance-produksi/attendance-produksi.service';
import { EmployeeService } from 'src/employee/employee.service';
import { DepartmentService } from 'src/department/department.service';
import { Department } from 'src/department/entities/department.entity';
import { AttendanceProduksi } from 'src/attendance-produksi/entities/attendance-produksi.entity';
import { Employee } from 'src/employee/entities/employee.entity';
import { Repository } from 'typeorm';
import * as moment from 'moment'
import { Loan } from 'src/loans/entities/loan.entity';
import { CreateLoanDto } from 'src/loans/dto/create-loan.dto';
import { UpdatePayslipProduksiWithBonDto } from './dto/update-payslip-produksi-with-bon.dto';
import { LoansService } from 'src/loans/loans.service';
import { hitungPotongan } from 'src/function';
import { UpdatePayslipProduksiPotonganDto } from './dto/update-payslip-produksi-potongan.dto';

@Injectable()
export class PayslipProduksiService extends TypeOrmCrudService<PayslipProduksi> {
  constructor(@InjectRepository(PayslipProduksi) repo,
    private readonly employeeService: EmployeeService,
    private readonly attendanceService: AttendanceProduksiService,
    private readonly departmentService: DepartmentService,
    @InjectRepository(AttendanceProduksi)
    private readonly attendanceProduksiRepo: Repository<AttendanceProduksi>,
    @InjectRepository(Loan)
    private readonly loanRepo: Repository<Loan>,
    private readonly loanService: LoansService,
  ) {
    super(repo)
  }

  async deleteByRangeDate(periode_start, periode_end){
    return await this.repo.createQueryBuilder('PayslipProduksi')
      .delete()
      .where('periode_start = :periode_start AND periode_end = :periode_end', {
        periode_start : periode_start,
        periode_end : periode_end
      }).execute()
    
  }

  async customCreateOne(req ?: CrudRequest, dto?: CreatePayslipProduksiDto) {
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
    const payslipProd: PayslipProduksi[] = await this.repo.find({
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
    if (payslipProd.length > 0) {
      return payslipProd
    } else {
      let insertPayslip = []
      for (var i = 0; i < employee.length; i++) {
        const emp = employee[i]
        const total_hari_kerja = 7

        let attendance =
          await this.attendanceProduksiRepo.createQueryBuilder('attendanceproduksi')
            .addSelect(`DATE(attendance_date)`, 'attendance_date')
            .addSelect('attendance_type')
            .addSelect('time_check_in')
            .addSelect('time_check_out')
            .addSelect('time_start_for_break')
            .addSelect('time_end_for_break')
            .addSelect('time_start_for_left')
            .addSelect('time_end_for_left')
            .addSelect('time_arrive_home')
            .addSelect('overtime')
            .addSelect('work_duration')
            .addSelect('early_overtime')
            .addSelect('total_leave')
            .addSelect('isOvertime')
            .addSelect('is_early_overtime')
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
          const gaji_pokok = emp.department.id ==1 ? emp.department.umr / 30 : emp.department.id == 3 ? emp.gaji_pokok : 0
          const bonus_lama_kerja = lama_kerja * 50
          const upah_1_hari = gaji_pokok + bonus_lama_kerja
          const total_tunjangan_kehadiran = emp.tunjangan_kehadiran * total_hari_masuk
          const upah_n_hari = (upah_1_hari * total_hari_masuk) + total_tunjangan_kehadiran


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



          const extra_full = (total_hari_masuk == 6 && total_leave == 0) ? emp.extra_full : 0

          let total_lembur_awal = 0
          let total_lembur = 0

          for (var j = 0; j < attendance.length; j++) {
            var att = attendance[j]

            var itunglemburawal = (upah_1_hari / 7) * (att.early_overtime / 60)
            // console.log('itung lembur awal :' + itunglemburawal)
            total_lembur_awal += itunglemburawal


            if (att.overtime <= 60) {
              let ov = (upah_1_hari * 30) * 1.5 * (att.overtime / 60) / 173
              // console.log('ov : ' + ov)
              total_lembur += ov

            } else {
              let ov1 = (upah_1_hari * 30) * 1.5 * 1 / 173
              let ov2 = (upah_1_hari * 30) * 2 * ((att.overtime - 60) / 60) / 173
              total_lembur += ov1 + ov2
              // console.log('ov1 : ' + ov1 + ' ov2 : ' + ov2)

            }
          }
          // console.log('total lembur awal' + total_lembur_awal)
          // console.log('total lembur ' + total_lembur)

          const lembur = total_lembur_awal + total_lembur
          const upah_minggu = gaji_pokok
          const premi_hari_besar = gaji_pokok * (total_hari_libur - 1)
          const total_pendapatan = upah_n_hari + extra_full + lembur + upah_minggu + premi_hari_besar


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
            lama_kerja, gaji_pokok, bonus_lama_kerja, upah_1_hari, total_tunjangan_kehadiran,
            upah_n_hari, extra_full, lembur, upah_minggu, premi_hari_besar, total_pendapatan,
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
        await this.repo.save(savePayslip)
        const payslipProdFinal : PayslipProduksi[] = await this.repo.find({
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
        return payslipProdFinal
      } else {
        throw new HttpException('Not found Attendance : '+ nameNull, HttpStatus.NOT_FOUND);
      }
     
    }

  }

  async inputBon(dto: UpdatePayslipProduksiWithBonDto, req: CrudRequest) {
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
    // console.log(dto.idPayslip)
    await this.repo.update(dto.idPayslip, updateBonPayslip)
    const payslip: PayslipProduksi[] = await this.repo.find({
      where: {
        periode_start: payslipNow.periode_start,
        periode_end: payslipNow.periode_end,
        employee: {
          department: {
            name: dto.departemen
          }
        }
      },
      relations: ['employee', 'employee.department', 'employee.area', 'employee.position']
    })
    return payslip
  }
  
  async inputPotongan(dto: UpdatePayslipProduksiPotonganDto, req: CrudRequest) {
    console.log(dto.idPayslip)
    const payslipNow = await this.repo.findOne({
      where: {
        id: dto.idPayslip
      }
    })
    console.log(payslipNow)
    const total_potongan = parseInt(payslipNow.total_potongan+'') + parseInt(dto.potongan_lain+'')
    const updateBonPayslip = {
      potongan_lain: dto.potongan_lain,
      total_potongan: total_potongan,
      pendapatan_gaji : payslipNow.total_pendapatan - total_potongan,
      id: dto.idPayslip
    }
    console.log(updateBonPayslip)
    await this.repo.update(dto.idPayslip, updateBonPayslip)
    const payslip: PayslipProduksi[] = await this.repo.find({
      where: {
        periode_start: payslipNow.periode_start,
        periode_end: payslipNow.periode_end,
        
      },
      relations: ['employee', 'employee.department', 'employee.area', 'employee.position']
    })
    return payslip
  }
  
  async getTotalPengeluaran(bulan : string) : Promise <any>{
    try {
      // console.log(bulan)
      const bln = bulan.split('-')
      const queryBuilder = this.repo.createQueryBuilder('PayslipProduksi')
      queryBuilder
      .select('distinct(periode_start)', 'periode_start')
      .addSelect('periode_end')
      .addSelect('sum(pendapatan_gaji)', 'pendapatan_gaji')
      // .addSelect('department.id', 'department_id')
      // .addSelect('department.name')
      // .leftJoin('PayslipProduksi.employee', 'employee')
      // .leftJoin('employee.department', 'department')
      .where('year(periode_start) = :year', {year : bln[0]})
      .andWhere('month(periode_start) = :month', {month: bln[1]})
      .addGroupBy('periode_start')
      .addGroupBy('periode_end')
      // .addGroupBy('department_id')
      // .addGroupBy('department_name')
      const hasil = await queryBuilder.getRawMany()
      hasil.map(item =>{
        item['department_id'] = 1
        item['department_name'] = 'Produksi'
        return item
      } )
      console.log(hasil)
      
      
      return hasil
    } catch (error) {
      return Promise.reject(error)
    }
  }
  
  async getDetailPengeluaran(periode_awal : string, periode_akhir : string) : Promise <any>{
    try {
      // console.log(bulan)
      
      const queryBuilder = this.repo.createQueryBuilder('PayslipProduksi')
      queryBuilder
      .select('PayslipProduksi.pendapatan_gaji', 'pendapatan_gaji')
      .addSelect('employee.name', 'name')
      .addSelect('employee.id', 'id')
      .addSelect('department.name', 'department')
      .addSelect('area.name', 'area')
      .addSelect('position.name', 'position')
      
      .leftJoin('PayslipProduksi.employee', 'employee')
      .leftJoin('employee.department', 'department')
      .leftJoin('employee.area','area')
      .leftJoin('employee.position','position')
      .where('PayslipProduksi.periode_start = date(:periode_awal)', {periode_awal : periode_awal})
      .andWhere('PayslipProduksi.periode_end = date(:periode_akhir)', {periode_akhir: periode_akhir})

      const hasil = await queryBuilder.getRawMany()
      console.log(hasil)
      
      
      return hasil
    } catch (error) {
      return Promise.reject(error)
    }
  }
  

}
