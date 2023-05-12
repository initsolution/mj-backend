import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { AttendanceBulananService } from 'src/attendance-bulanan/attendance-bulanan.service';
import { AttendanceBulanan } from 'src/attendance-bulanan/entities/attendance-bulanan.entity';
import { DepartmentService } from 'src/department/department.service';
import { EmployeeService } from 'src/employee/employee.service';
import { Employee } from 'src/employee/entities/employee.entity';
import { Loan } from 'src/loans/entities/loan.entity';
import { LoansService } from 'src/loans/loans.service';
import { Repository } from 'typeorm';
import { CreatePayslipBulananDto } from './dto/create-payslip-bulanan.dto';
import { UpdatePayslipBulananDto } from './dto/update-payslip-bulanan.dto';
import { PayslipBulanan } from './entities/payslip-bulanan.entity';
import * as moment from 'moment'
import { hitungPotongan, hitungTelat } from 'src/function';
import { UpdatePayslipBulananWithBonDto } from './dto/update-payslip-bulanan-with-bon.dto';
import { CreateLoanDto } from 'src/loans/dto/create-loan.dto';
import { UpdatePayslipBulananPotonganDto } from './dto/update-payslip-bulanan-potongan.dto';
import { UpdatePayslipBulananTambahanLainDto } from './dto/update-payslip-bulanan-tambahan-lain.dto';


@Injectable()
export class PayslipBulananService extends TypeOrmCrudService<PayslipBulanan> {
  constructor(@InjectRepository(PayslipBulanan) repo,
    private readonly employeeService: EmployeeService,
    private readonly attendanceService: AttendanceBulananService,
    private readonly departmentService: DepartmentService,
    @InjectRepository(AttendanceBulanan)
    private readonly attendanceBulananRepo: Repository<AttendanceBulanan>,
    @InjectRepository(Loan)
    private readonly loanRepo: Repository<Loan>,
    private readonly loanService: LoansService,
  ) {
    super(repo)
  }

  async customCreateOne(req?: CrudRequest, dto?: CreatePayslipBulananDto) {
    let cekNullAtt = 0
    let nameNull = ''
    // console.log(dto)
    const employee: Employee[] = await this.employeeService.find({
      where: {
        // id : '0320190187',
        
        active: 1,
        department: {
          name: dto.departemen
        }
      },
      relations: ['department', 'loan']
    })
    const payslipBulanan: PayslipBulanan[] = await this.repo.find({
      where: {
        periode_start: new Date(dto.periode_start).toISOString(),
        periode_end: new Date(dto.periode_end).toISOString(),
        employee: {
          department: {
            name: dto.departemen
          },
        }
      },
      relations: ['employee', 'employee.department', 'employee.area', 'employee.position'],
      order: {
        employee: {
          name: 'ASC'
        }
      },
    })

    // console.log(payslipProd.length)
    // console.log(employee.length)
    if (payslipBulanan.length > 0) {
      return payslipBulanan
    } else {
      let insertPayslip = []
      for (var i = 0; i < employee.length; i++) {
        const emp = employee[i]


        let attendance =
          await this.attendanceBulananRepo.createQueryBuilder('attendancebulanan')
            .addSelect(`DATE(attendance_date)`, 'attendance_date')
            .addSelect('time_check_in')
            .addSelect('time_check_out')
            .addSelect('time_start_for_break_1')
            .addSelect('time_end_for_break_1')
            .addSelect('time_start_for_break_2')
            .addSelect('time_end_for_break_2')
            .addSelect('time_start_for_left_1')
            .addSelect('time_end_for_left_1')
            .addSelect('time_start_for_left_2')
            .addSelect('time_end_for_left_2')
            .addSelect('time_start_for_left_3')
            .addSelect('time_end_for_left_3')
            .addSelect('work_duration')
            .addSelect('total_leave')
            .addSelect('work_hours')
            .addSelect('break_hours')
            .addSelect('lembur')
            .where(`employeeId = :employee_id AND DATE(attendance_date) BETWEEN DATE(:periode_start) AND DATE(:periode_end)`, {
              employee_id: emp.id,
              // employee_id: '0320190187',
              periode_start: dto.periode_start,
              periode_end: dto.periode_end
            })
            .orderBy('attendance_date', 'ASC')
            .getMany()

        // console.log(attendance)
        if (attendance.length > 0) {
          // pengeluaran
          let totalTelat = 0
          let totalIjin = 0
          let totalLembur = 0
          let total_hari_masuk = 0


          attendance.forEach((value, idx) => {

            // ijin + telat
            if (value.total_leave != null) {
              var leave = value.total_leave.split(',')
              for (var j = 0; j < (leave.length - 1); j++) {
                totalTelat += parseInt(leave[j])
              }
              totalIjin += parseInt(leave[3])
            }

            // kelebihan jam kerja
            totalLembur += value.lembur

          })
          // console.log('total ijin : '+totalIjin)
          // console.log('total lembur : '+totalLembur)

          if (totalTelat <= 30) {
            totalTelat = 0
          } else {
            // console.log('total telat : '+totalTelat)
            totalIjin += totalTelat
          }
          // console.log('total ijin + telat : '+totalIjin)
          // total menit ijin setelah di up 30 menit
          totalIjin = hitungTelat(totalIjin)
          // console.log('total ijin + telat up : '+totalIjin)


          // hitung akumulasi lembur dalam 1 bulan
          totalLembur = Math.floor(totalLembur / 60) * 60
          // console.log('total lembur down : '+totalLembur)

          // total_hari_masuk = (totalLembur - totalIjin) / (8 * 60)

          // let diffLemburIjin = totalLembur - totalIjin

          const periodeStart = moment(dto.periode_start)
          const periodeEnd = moment(dto.periode_end)
          const jumlah_hari = periodeEnd.diff(periodeStart, 'days') + 1
          // console.log('jumlah_hari : '+jumlah_hari)
          const total_hari_libur = (dto.day_off.length)
          // console.log('total_hari_libur : '+total_hari_libur)
          const total_hari_kerja = jumlah_hari - total_hari_libur
          // console.log('total_hari_kerja : '+total_hari_kerja)
          const jumlah_kehadiran = attendance.length
          // console.log('jumlah_kehadiran : '+jumlah_kehadiran)
          total_hari_masuk = jumlah_kehadiran - ((totalIjin / 60) / 8) + ((totalLembur / 60) / 8)
          // console.log('total ijin /8 : '+((totalIjin / 60) / 8))
          // console.log('total lembur /8 : '+((totalLembur / 60) / 8))
          // console.log('total_hari_masuk: '+total_hari_masuk)
          const total_hari_tidak_masuk = total_hari_kerja > total_hari_masuk ? total_hari_kerja - total_hari_masuk : 0
          // console.log('total_hari_tidak_masuk: '+total_hari_tidak_masuk)
          



          const total_hari_off = total_hari_tidak_masuk
          // console.log('total_hari_off: '+total_hari_off)
          
          // const total_hari_off = total_hari_kerja - total_hari_masuk - total_hari_libur


          //pendapatan

          const now = moment()
          const active_date = moment(emp.active_date)
          const lama_kerja = now.diff(active_date, 'years')
          const tunjangan_jabatan = emp.tunjangan_jabatan // nanti ganti jadi master data
          // dept 1(produksi), 3(helper)
          // console.log('tunjangan_jabatan: '+tunjangan_jabatan)
          
          const gaji_pokok = emp.gaji_pokok
          // console.log('gaji_pokok: '+gaji_pokok)
          

          const upah_1_hari = (gaji_pokok + tunjangan_jabatan) / 25
          // console.log('upah_1_hari: '+upah_1_hari)
          
          // const insentif_extra =     total_hari_masuk * emp.insentif_extra
          let insentif_extra = 0
          if (total_hari_kerja < total_hari_masuk) {
            insentif_extra = total_hari_kerja * emp.insentif_extra
          } else {
            insentif_extra = total_hari_masuk * emp.insentif_extra
          }
          // console.log('insentif_extra: '+insentif_extra)
          

          const kelebihan_hari = total_hari_masuk - total_hari_kerja
          // console.log('kelebihan_hari: '+kelebihan_hari)
          
          const lembur = kelebihan_hari
          // jika non office, extra tambahan kerja keluar
          let extra_tambahan_kerja = 0
          if (emp.type == 'REGULER') {
            extra_tambahan_kerja = kelebihan_hari < 0 ? 0 : kelebihan_hari * emp.extra_tambahan_kerja
          }
          // console.log('extra_tambahan_kerja: '+extra_tambahan_kerja)
          


          const tambahan_gaji_lain = 0 // nanti menambahkan manual
          const total_pendapatan = gaji_pokok + tunjangan_jabatan + insentif_extra + extra_tambahan_kerja + tambahan_gaji_lain
          
          // console.log('total_pendapatan: '+total_pendapatan)
          
          // potongan
          const potongan_hari_kerja = total_hari_tidak_masuk * upah_1_hari
          // console.log('potongan_hari_kerja: '+potongan_hari_kerja)
          
          // const potongan_hari_kerja = (totalIjin / (8 * 60)) * upah_1_hari
          const potongan_bpjs_tk = emp.iuran_bpjs_tk
          const potongan_bpjs_ks = emp.iuran_bpjs_ks

          let potongan_bon = 0


          const total_potongan = potongan_hari_kerja + potongan_bpjs_tk + potongan_bpjs_ks + potongan_bon
          // console.log('total_potongan: '+total_potongan)
          

          const pendapatan_gaji = total_pendapatan - total_potongan
          // console.log('pendapatan_gaji: '+pendapatan_gaji)
          
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
            total_hari_kerja, total_hari_masuk, total_hari_off, total_hari_libur,lembur,
            gaji_pokok, tunjangan_jabatan, insentif_extra, extra_tambahan_kerja,
            tambahan_gaji_lain, total_pendapatan,
            potongan_hari_kerja, potongan_bpjs_tk, potongan_bpjs_ks,
            potongan_bon, total_potongan,
            pendapatan_gaji, sisa_bon
          }

          // console.log(inputData)

          insertPayslip.push(inputData)

        }
        else {
          cekNullAtt++
          nameNull += 'id ' + emp.id + ' nama ' + emp.name + '\n'
        }
      }

      // if (cekNullAtt == 0) {

        const savePayslip = await this.repo.create(insertPayslip)
        await this.repo.save(savePayslip)
        const payslipProdFinal: PayslipBulanan[] = await this.repo.find({
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
            employee: {
              name: 'ASC'
            }
          },
        })
        return payslipProdFinal
      // } else {
      //   throw new HttpException('Not found Attendance : ' + nameNull, HttpStatus.NOT_FOUND);
      // }

    }

  }
  
  async inputBon(dto: UpdatePayslipBulananWithBonDto, req: CrudRequest) {
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
    const payslip: PayslipBulanan[] = await this.repo.find({
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
  
  async inputPotongan(dto: UpdatePayslipBulananPotonganDto, req: CrudRequest) {
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
    const payslip: PayslipBulanan[] = await this.repo.find({
      where: {
        periode_start: payslipNow.periode_start,
        periode_end: payslipNow.periode_end,
        
      },
      relations: ['employee', 'employee.department', 'employee.area', 'employee.position']
    })
    return payslip
  }
  
  async inputTambahanLain(dto: UpdatePayslipBulananTambahanLainDto, req: CrudRequest) {
    const payslipNow = await this.repo.findOne({
      where: {
        id: dto.idPayslip
      }
    })
    const tambahan_gaji_lain = parseInt(dto.tambahan_gaji_lain+'')
    const total_pendapatan = parseInt(payslipNow.total_pendapatan+'') + tambahan_gaji_lain
    const updateBonPayslip = {
      tambahan_gaji_lain: tambahan_gaji_lain,
      total_pendapatan: total_pendapatan,
      pendapatan_gaji : parseInt(total_pendapatan+'') - parseInt(payslipNow.total_potongan+''),
      id: dto.idPayslip
    }
    console.log(updateBonPayslip)
    await this.repo.update(dto.idPayslip, updateBonPayslip)
    const payslip: PayslipBulanan[] = await this.repo.find({
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
      const queryBuilder = this.repo.createQueryBuilder('PayslipBulanan')
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
        item['department_id'] = 4
        item['department_name'] = 'Bulanan'
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
      
      const queryBuilder = this.repo.createQueryBuilder('PayslipBulanan')
      queryBuilder
      .select('PayslipBulanan.pendapatan_gaji', 'pendapatan_gaji')
      .addSelect('employee.name', 'name')
      .addSelect('employee.id', 'id')
      .addSelect('department.name', 'department')
      .addSelect('area.name', 'area')
      .addSelect('position.name', 'position')
      
      .leftJoin('PayslipBulanan.employee', 'employee')
      .leftJoin('employee.department', 'department')
      .leftJoin('employee.area','area')
      .leftJoin('employee.position','position')
      .where('PayslipBulanan.periode_start = date(:periode_awal)', {periode_awal : periode_awal})
      .andWhere('PayslipBulanan.periode_end = date(:periode_akhir)', {periode_akhir: periode_akhir})

      const hasil = await queryBuilder.getRawMany()
      console.log(hasil)
      
      
      return hasil
    } catch (error) {
      return Promise.reject(error)
    }
  }

}
