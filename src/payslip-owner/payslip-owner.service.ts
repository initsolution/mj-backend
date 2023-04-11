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

@Injectable()
export class PayslipOwnerService extends TypeOrmCrudService<PayslipOwner> {
  constructor(@InjectRepository(PayslipOwner) repo,
  private readonly employeeService: EmployeeService,
  private readonly payslipBulananService : PayslipBulananService,
  private readonly loanService: LoansService,
  ){
    super(repo)
  }
  
  async customCreateOne(req?: CrudRequest, dto?: CreatePayslipOwnerDto){
    const employee: Employee[] = await this.employeeService.find({
      where: {
        active: 1,
        type: 'KHUSUS'
      },
      relations: ['department', 'loan']
    })
    for(var i =0; i< employee.length; i++){
      var emp = employee[i]
      let payslipBulanan: PayslipBulanan = await this.repo.findOne({
        where: {
          periode_start: new Date(dto.periode_start).toISOString(),
          periode_end: new Date(dto.periode_end).toISOString(),
          employee: {
            id : emp.id
          }
        },
        relations: ['employee', 'employee.department', 'employee.area', 'employee.position'],
        order: {
          employee: {
            name: 'ASC'
          }
        },
      })
      
      const periode_start = dto.periode_start
      const periode_end = dto.periode_end
      const total_hari_kerja = payslipBulanan.total_hari_kerja
      const total_hari_masuk = payslipBulanan.total_hari_masuk
      const total_hari_off = payslipBulanan.total_hari_off
      const total_hari_libur = payslipBulanan.total_hari_libur
      const gaji_pokok = payslipBulanan.gaji_pokok
      const total_buku_1 = payslipBulanan.total_pendapatan
      const total_potongan_1 = payslipBulanan.total_potongan
      let tambahan = (total_hari_masuk- total_hari_kerja) * emp.owner_overtime_rate
      if(tambahan < 0) tambahan = 0
      let lembur = 0
      let bonus_khusus =0
      if(total_hari_kerja > total_hari_masuk){
        lembur = total_hari_masuk * emp.owner_rate
        bonus_khusus = emp.owner_bonus_khusus
      }else{
        lembur = total_hari_kerja * emp.owner_rate
        bonus_khusus = (total_hari_kerja/total_hari_masuk) * emp.owner_bonus_khusus
      }
      const total_buku_2 = tambahan+lembur+bonus_khusus
      const potongan_astek_plus =0
      const potongan_bon = 0
      const total_potongan_2 = 0
      const total_bersih_buku_1 = payslipBulanan.pendapatan_gaji
      const total_bersih_buku_2 = total_buku_2 - total_potongan_2
      const pendapatan_gaji = total_bersih_buku_1 + total_bersih_buku_2
      
      const inputData = {
        employee: emp,
        periode_start, periode_end, total_hari_kerja,  total_hari_masuk,
        total_hari_off, total_hari_libur, gaji_pokok, total_buku_1, total_potongan_1,
        tambahan, lembur, bonus_khusus, total_buku_2,
        potongan_astek_plus, potongan_bon, total_potongan_2,
        total_bersih_buku_1, total_bersih_buku_2, pendapatan_gaji
      }
      
    }
    
    
    
    
    
  }
  
  
}
