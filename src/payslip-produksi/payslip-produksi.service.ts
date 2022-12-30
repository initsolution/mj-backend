import { Injectable } from '@nestjs/common';
import { CreatePayslipProduksiDto } from './dto/create-payslip-produksi.dto';
import { UpdatePayslipProduksiDto } from './dto/update-payslip-produksi.dto';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { PayslipProduksi } from './entities/payslip-produksi.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest } from '@nestjsx/crud';
import { AttendanceService } from 'src/attendance/attendance.service';
import { EmployeeService } from 'src/employee/employee.service';
import { DepartmentService } from 'src/department/department.service';
import { Department } from 'src/department/entities/department.entity';
import { Attendance } from 'src/attendance/entities/attendance.entity';
import { Employee } from 'src/employee/entities/employee.entity';
import { Repository } from 'typeorm';
import * as moment from 'moment'

@Injectable()
export class PayslipProduksiService extends TypeOrmCrudService<PayslipProduksi> {
  constructor(@InjectRepository(PayslipProduksi) repo,
    private readonly employeeService: EmployeeService,
    private readonly attendanceService: AttendanceService,
    private readonly departmentService: DepartmentService,
    @InjectRepository(Attendance)
    private readonly attendanceRepo: Repository<Attendance>,
  ) {
    super(repo)
  }

  async customCreateOne(req: CrudRequest, dto: CreatePayslipProduksiDto) {
    const employee: Employee[] = await this.employeeService.find({
      where: {
        active: 1,
        department: {
          name: dto.departemen
        }
      },
      relations: ['department']
    })
    const payslipProd: PayslipProduksi[] = await this.repo.find({
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

    console.log(payslipProd.length)
    if (payslipProd.length > 0) {
        return payslipProd
    } else {
      let insertPayslip = []
      for (var i = 0; i < employee.length; i++) {
        const emp = employee[i]
        const total_hari_kerja = 7

        let attendance =
          await this.attendanceRepo.createQueryBuilder('attendance')
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
            .where(`employeeId = :employee_id AND DATE(attendance_date) BETWEEN :periode_start AND :periode_end`, {
              employee_id: emp.id,
              periode_start: dto.periode_start,
              periode_end: dto.periode_end
            })
            .orderBy('attendance_date', 'ASC')

            .getMany()

        // console.log(attendance)
        // console.log(dto.day_off)
        const total_hari_masuk = attendance.filter(function (att) {
          return (att.time_check_in != null && att.time_check_out != null && !dto.day_off.includes(att.attendance_date))
        }).length
        const total_hari_libur = (dto.day_off.length)
        const total_hari_off = total_hari_kerja - total_hari_masuk - total_hari_libur
        const now = moment()
        const active_date = moment(emp.active_date)
        const lama_kerja = now.diff(active_date, 'years')
        const gaji_pokok = emp.department.umr / 30
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
              var potonganijintelat = this.hitungPotongan(parseInt(leave[j]), (upah_1_hari + emp.tunjangan_kehadiran))
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
        const potongan_bpjs_ks = emp.iuran_bjs_ks
        const potongan_spsi = emp.iuran_spsi
        const potongan_bon = 0
        const potongan_lain = 0
        const total_potongan = potongan_terlambat_ijin + potongan_bpjs_tk + potongan_bpjs_ks + potongan_spsi + potongan_bon + potongan_lain

        const pendapatan_gaji = total_pendapatan - total_potongan
        const sisa_bon = 0
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

      const savePayslip = await this.repo.create(insertPayslip)
      return await this.repo.save(savePayslip)
    }

  }

  hitungPotongan(waktu: number, upahtunjangan: number): number {
    if (waktu == 0) {
      return 0
    }
    else if (waktu <= 3 && waktu > 0) {
      return 2000
    } else if (waktu <= 5 && waktu >= 4) {
      return 3000
    } else if (waktu > 5) {
      return (upahtunjangan / 7) * (waktu / 60)
    }
  }

}
