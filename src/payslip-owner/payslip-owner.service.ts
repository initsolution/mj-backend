import { Injectable } from '@nestjs/common';
import { CreatePayslipOwnerDto } from './dto/create-payslip-owner.dto';
import { UpdatePayslipOwnerDto } from './dto/update-payslip-owner.dto';
import { PayslipOwner } from './entities/payslip-owner.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeService } from 'src/employee/employee.service';
import { PayslipBulananService } from 'src/payslip-bulanan/payslip-bulanan.service';
import { LoansService } from 'src/loans/loans.service';
import { CrudRequest } from '@nestjsx/crud';
import { Employee } from 'src/employee/entities/employee.entity';
import { PayslipBulanan } from 'src/payslip-bulanan/entities/payslip-bulanan.entity';
import { UpdatePayslipOwnerWithBonDto } from './dto/update-payslip-owner-bon.dto';
import { CreateLoanDto } from 'src/loans/dto/create-loan.dto';
import { UpdatePayslipOwnerTotalHariMasuk } from './dto/update-payslip-owner-total-hari-kerja.dto';

@Injectable()
export class PayslipOwnerService extends TypeOrmCrudService<PayslipOwner> {
  constructor(@InjectRepository(PayslipOwner) repo,
    private readonly employeeService: EmployeeService,
    private readonly payslipBulananService: PayslipBulananService,
    private readonly loanService: LoansService,
  ) {
    super(repo)
  }

  async deleteByRangeDate(periode_start, periode_end){
    return await this.repo.createQueryBuilder('PayslipOwner')
      .delete()
      .where('periode_start = :periode_start AND periode_end = :periode_end', {
        periode_start : periode_start,
        periode_end : periode_end
      }).execute()
    
  }

  async customCreateOne(req?: CrudRequest, dto?: CreatePayslipOwnerDto) {
    const employee: Employee[] = await this.employeeService.find({
      where: {
        active: 1,
        type: 'KHUSUS'
      },
      relations: ['department', 'loan']
    })
    console.log(employee)
    let insertPayslip = []
    let payslipOwnerCheck: PayslipOwner[] = await this.repo.find({
      where: {
        periode_start: new Date(dto.periode_start).toISOString(),
        periode_end: new Date(dto.periode_end).toISOString(),

      },
      relations: ['employee', 'employee.department', 'employee.area', 'employee.position'],
      order: {
        employee: {
          name: 'ASC'
        }
      },
    })
    if (payslipOwnerCheck.length > 0) {

    } else {
      for (var i = 0; i < employee.length; i++) {
        var emp = employee[i]
        let payslipBulanan: PayslipBulanan = await this.payslipBulananService.findOne({
          where: {
            periode_start: new Date(dto.periode_start).toISOString(),
            periode_end: new Date(dto.periode_end).toISOString(),
            employee: {
              id: emp.id
            }
          },
          relations: ['employee', 'employee.department', 'employee.area', 'employee.position'],
          order: {
            employee: {
              name: 'ASC'
            }
          },
        })
        if (payslipBulanan != null) {

          const periode_start = dto.periode_start
          const periode_end = dto.periode_end
          const total_hari_kerja = payslipBulanan.total_hari_kerja
          const total_hari_masuk = payslipBulanan.total_hari_masuk
          const total_hari_off = payslipBulanan.total_hari_off
          const total_hari_libur = payslipBulanan.total_hari_libur
          const gaji_pokok = payslipBulanan.gaji_pokok
          const total_buku_1 = payslipBulanan.total_pendapatan
          const total_potongan_1 = payslipBulanan.total_potongan
          let tambahan = (total_hari_masuk - total_hari_kerja) * emp.owner_overtime_rate
          if (tambahan < 0) tambahan = 0
          let lembur = 0
          let bonus_khusus = 0
          if (total_hari_kerja <= total_hari_masuk) {
            lembur = total_hari_kerja * emp.owner_rate
            bonus_khusus = emp.owner_bonus_khusus
          } else {
            lembur = total_hari_masuk * emp.owner_rate
            bonus_khusus = (total_hari_masuk / total_hari_kerja) * emp.owner_bonus_khusus
          }
          const total_buku_2 = tambahan + lembur + bonus_khusus
          const potongan_astek_plus = emp.owner_astek_plus
          const potongan_bon = 0
          const total_potongan_2 = potongan_bon + potongan_astek_plus
          const total_bersih_buku_1 = payslipBulanan.pendapatan_gaji
          const total_bersih_buku_2 = total_buku_2 - total_potongan_2
          const pendapatan_gaji = total_bersih_buku_1 + total_bersih_buku_2
          let sisa_bon = 0
          if (emp.loan.length > 0) {
            const loan = emp.loan.sort((a, b) => {
              let da = new Date(a.created_at)
              let db = new Date(b.created_at)
              return db.getTime() - da.getTime()
            })
            sisa_bon = loan[0].total_loan_current
          }

          const inputData = {
            employee: emp,
            periode_start, periode_end, total_hari_kerja, total_hari_masuk,
            total_hari_off, total_hari_libur, gaji_pokok, total_buku_1, total_potongan_1,
            tambahan, lembur, bonus_khusus, total_buku_2,
            potongan_astek_plus, potongan_bon, total_potongan_2, sisa_bon,
            total_bersih_buku_1, total_bersih_buku_2, pendapatan_gaji
          }
          insertPayslip.push(inputData)

        }

      }
      const savePayslip = await this.repo.create(insertPayslip)
      await this.repo.save(savePayslip)

    }

    const payslipOwnerFinal: PayslipOwner[] = await this.repo.find({
      where: {
        periode_start: new Date(dto.periode_start).toISOString(),
        periode_end: new Date(dto.periode_end).toISOString(),
        employee: {

        }
      },
      relations: ['employee', 'employee.department', 'employee.area', 'employee.position'],
      order: {
        employee: {
          name: 'ASC'
        }
      },
    })

    return payslipOwnerFinal

  }

  async changeTotalHariMasukKerja(dto: UpdatePayslipOwnerTotalHariMasuk) {
    const payslipOwner: PayslipOwner = await this.repo.findOne({
      where: {
        id: dto.idPayslip
      },
      relations: ['employee'],
    })
    const periode_start = payslipOwner.periode_start
    const periode_end = payslipOwner.periode_end
    const total_hari_kerja = payslipOwner.total_hari_kerja
    const total_hari_masuk = dto.total_hari_masuk
    const total_hari_off = total_hari_kerja - total_hari_masuk
    // const total_hari_off = payslipOwner.total_hari_off
    const total_hari_libur = payslipOwner.total_hari_libur
    const gaji_pokok = payslipOwner.gaji_pokok
    const total_buku_1 = payslipOwner.total_buku_1
    const total_potongan_1 = payslipOwner.total_potongan_1
    const owner_overtime_rate = payslipOwner.employee.owner_overtime_rate
    const owner_rate = payslipOwner.employee.owner_rate
    const owner_bonus_khusus = payslipOwner.employee.owner_bonus_khusus
    const owner_astek_plus = payslipOwner.employee.owner_astek_plus
    let tambahan = (total_hari_masuk - total_hari_kerja) * owner_overtime_rate
    if (tambahan < 0) tambahan = 0
    let lembur = 0
    let bonus_khusus = 0
    if (total_hari_kerja <= total_hari_masuk) {
      lembur = total_hari_kerja * owner_rate
      bonus_khusus = owner_bonus_khusus
    } else {
      lembur = total_hari_masuk * owner_rate
      bonus_khusus = (total_hari_masuk / total_hari_kerja) * owner_bonus_khusus
    }
    const total_buku_2 = tambahan + lembur + bonus_khusus
    const potongan_astek_plus = owner_astek_plus
    const potongan_bon = 0
    const total_potongan_2 = potongan_bon + potongan_astek_plus
    const total_bersih_buku_1 = payslipOwner.total_bersih_buku_1
    const total_bersih_buku_2 = total_buku_2 - total_potongan_2
    const pendapatan_gaji = total_bersih_buku_1 + total_bersih_buku_2

    const updatePayslip = {
      total_hari_masuk, total_hari_off,
      tambahan, lembur, bonus_khusus, total_buku_2,
      potongan_astek_plus, potongan_bon, total_potongan_2,
      total_bersih_buku_2, pendapatan_gaji
    }
    await this.repo.update(dto.idPayslip, updatePayslip)
    const payslipOwnerFinal: PayslipOwner[] = await this.repo.find({
      where: {
        periode_start: new Date(payslipOwner.periode_start).toISOString(),
        periode_end: new Date(payslipOwner.periode_end).toISOString(),
        employee: {

        }
      },
      relations: ['employee', 'employee.department', 'employee.area', 'employee.position'],
      order: {
        employee: {
          name: 'ASC'
        }
      },
    })
    return payslipOwnerFinal
  }

  async inputBon(dto: UpdatePayslipOwnerWithBonDto, req: CrudRequest) {
    const loanDto: CreateLoanDto = {
      type: dto.type,
      employee: dto.employee,
      note: dto.note,
      nominal: dto.nominal,
      khusus : 1
    }
    const loan = await this.loanService.customCreateOne(req, loanDto)
    const payslipNow = await this.repo.findOne({
      where: {
        id: dto.idPayslip
      }
    })
    const total_potongan = parseInt(payslipNow.potongan_astek_plus + '') + parseInt(dto.nominal + '')
    const pendapatan_gaji = payslipNow.total_buku_2 - total_potongan
    const updateBonPayslip = {
      potongan_bon: dto.nominal,
      sisa_bon: loan.total_loan_current,
      total_potongan_2: total_potongan,
      pendapatan_gaji: pendapatan_gaji,
      
    }
    
    await this.repo.update(dto.idPayslip, updateBonPayslip)
    
    const payslipOwnerFinal: PayslipOwner[] = await this.repo.find({
      where: {
        periode_start: payslipNow.periode_start,
        periode_end: payslipNow.periode_end,
        
      },
      relations: ['employee', 'employee.department', 'employee.area', 'employee.position'],
      order: {
        employee: {
          name: 'ASC'
        }
      },
    })
    return payslipOwnerFinal
  }


}
