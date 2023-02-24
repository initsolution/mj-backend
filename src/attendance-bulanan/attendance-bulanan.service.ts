import { Injectable } from '@nestjs/common';
import { CreateAttendanceBulananDto } from './dto/create-attendance-bulanan.dto';
import { UpdateAttendanceBulananDto } from './dto/update-attendance-bulanan.dto';
import { AttendanceBulanan } from './entities/attendance-bulanan.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import * as moment from 'moment';
import { UpdateAttendanceBulananByShift } from './dto/update-attendance-bulanan-by-shift.dto';
import { ShiftService } from 'src/shift/shift.service';
import { Shift } from 'src/shift/entities/shift.entity';

@Injectable()
export class AttendanceBulananService extends TypeOrmCrudService<AttendanceBulanan> {
  constructor(@InjectRepository(AttendanceBulanan) repo,
  private readonly shiftService: ShiftService,
  ){
    super(repo)
  }
  async getCustomAttendance(): Promise<any>{
    try {
      const dateNow = moment(new Date())
      // .add(-1, 'days')
      .format("YYYY-MM-DD");
      let queryBuilder: any = await 
        this.repo.createQueryBuilder('AttendanceBulanan')
        .leftJoinAndSelect('AttendanceBulanan.employee', 'employee')
        .leftJoinAndSelect('AttendanceBulanan.shift', 'shift')
        .where('(DATE(AttendanceBulanan.created_at) = :now)',{now : dateNow})
        // .where('DATE(AttendanceProduksi.created_at) = '+dateNow)
        .orderBy(`employee.name`, `ASC`)
        .addOrderBy('AttendanceBulanan.attendance_date', 'ASC')
      return await queryBuilder.getMany()
    } catch (error) {
      return Promise.reject(error);
    }
  }
  
  async checkForDuplicate(employeeId: string, attendance_date: string): Promise<AttendanceBulanan[]> {
    try {
      return this.repo.find({
        where: {
          employee: {
            id: employeeId
          },
          attendance_date: attendance_date
        }
      })
    } catch (error) {
      return Promise.reject(error);
    }
  }
  
  async updateAttendanceByShift(dto: UpdateAttendanceBulananByShift) {
    let errorMessage: string = ''
    try {
      let att: AttendanceBulanan = await this.repo.findOne(
        {
          where:
            { id: dto.attendance_id },
          relations: ['shift', 'detailShift']
           
        })
      const shift: Shift = await this.shiftService.findOne(
        {
          where: {
            id: dto.shift_id,
            detailShift: {
              id: dto.detail_shift_id
            }
          },
          relations: [

            'detailShift'
          ]

        }
      )

      // console.log(att)
      // console.log(shift)
      
      
      att.break_hours = shift.detailShift[0].break_hours
      

      errorMessage += '\nshiftTimeCheckout : ' + shift.detailShift[0].end
      const shiftTimeCheckout = shift.detailShift[0].end.split(":")
      const totalShiftTimeCheckout = (parseInt(shiftTimeCheckout[0]) * 60) + parseInt(shiftTimeCheckout[1])  // + toleransi 30
      errorMessage += '\ntimeCheckOut : ' + att.time_check_out
      const timeCheckOut = att.time_check_out.split(":")
      const totalCheckout = (parseInt(timeCheckOut[0]) * 60) + parseInt(timeCheckOut[1])

      errorMessage += '\nshiftTimeCheckin : ' + shift.detailShift[0].start
      const shiftTimeCheckin = shift.detailShift[0].start.split(":")
      const totalShiftTimeCheckin = (parseInt(shiftTimeCheckin[0]) * 60) + parseInt(shiftTimeCheckin[1])  // - toleransi 30
      errorMessage += '\ntimeCheckIn : ' + att.time_check_in
      const timeCheckIn = att.time_check_in.split(":")
      const totalCheckIn = (parseInt(timeCheckIn[0]) * 60) + parseInt(timeCheckIn[1])

      const shiftTimeStartBreak = shift.detailShift[0].start_break != null ? shift.detailShift[0].start_break.split(':') : 0
      const totalShiftTimeStartBreak = shift.detailShift[0].start_break != null ? (parseInt(shiftTimeStartBreak[0]) * 60) + parseInt(shiftTimeStartBreak[1]) : 0
      const shiftTimeEndBreak = shift.detailShift[0].end_break != null ? shift.detailShift[0].end_break.split(':') : 0
      const totalShiftTimeEndBreak = shift.detailShift[0].end_break != null ? (parseInt(shiftTimeEndBreak[0]) * 60) + parseInt(shiftTimeEndBreak[1]) : 0
      let telat_masuk = 0
      let telat_masuk_setelah_istirahat = 0
      let telat_pulang_lebih_cepat = 0
      let ijin = 0


     

      if (totalShiftTimeCheckout > totalCheckout) {
        let itungTelat = totalShiftTimeCheckout - totalCheckout
        telat_pulang_lebih_cepat = itungTelat

        
      }

      //hitung ijin
      if (att.time_end_for_left && att.time_start_for_left) {
        errorMessage += '\ntimeEndForLeft : ' + att.time_end_for_left
        const timeEndForLeft = att.time_end_for_left.split(":")
        errorMessage += '\ntimeStartForLeft : ' + att.time_start_for_left
        const timeStartForLeft = att.time_start_for_left.split(":")
        ijin = ((parseInt(timeEndForLeft[0]) * 60) + parseInt(timeEndForLeft[1])) - ((parseInt(timeStartForLeft[0]) * 60) + parseInt(timeStartForLeft[1]))
        console.log(att.employee.id + '  - ijin : ' + ijin)

        if (Math.floor(ijin % 30) > 0) {

          let temp = Math.floor(ijin / 30) + 1
          // console.log(employeeShift.name +'  - ijin temp: '+temp)
          ijin = temp * 30
          // console.log(employeeShift.name +'  - ijin after : '+ijin)
        }
      }


      //hitung telat
      //telat masuk sebelum jam istirahat
      if (totalCheckIn > totalShiftTimeCheckin) {
        let itungTelat = totalCheckIn - totalShiftTimeCheckin
        if (totalCheckIn < totalShiftTimeStartBreak) {
          telat_masuk = itungTelat
        } else if (totalCheckIn >= totalShiftTimeStartBreak) {
          if (totalCheckIn <= totalShiftTimeEndBreak) {
            ijin += 240
          } else {
            ijin = + (itungTelat - 60)
          }
        }

      }


      //telat pulang

      // console.log(dataExcel.time_start_for_break)  
      //telat istirahat 
      if (att.time_start_for_break && att.time_end_for_break) {
        errorMessage += '\nshiftTimeStartBreak : ' + shift.detailShift[0].start_break

        errorMessage += '\ntimeCheckStartBreak : ' + att.time_start_for_break
        const timeCheckStartBreak = att.time_start_for_break.split(":")
        const totalCheckStartBreak = (parseInt(timeCheckStartBreak[0]) * 60) + parseInt(timeCheckStartBreak[1])

        errorMessage += '\nshiftTimeEndBreak : ' + shift.detailShift[0].end_break

        errorMessage += '\ntimeCheckEndBreak : ' + att.time_end_for_break
        const timeCheckEndBreak = att.time_end_for_break.split(":")
        const totalCheckEndBreak = (parseInt(timeCheckEndBreak[0]) * 60) + parseInt(timeCheckEndBreak[1])

        //start break
        // if (totalShiftTimeStartBreak > totalCheckStartBreak) {
        //   totalLeave += (totalShiftTimeStartBreak - totalCheckStartBreak)
        // }

        //end break
        if (totalCheckEndBreak > totalShiftTimeEndBreak) {

          let itungTelat = totalCheckEndBreak - totalShiftTimeEndBreak
         
            telat_masuk_setelah_istirahat = itungTelat
         
        }
      }

      att.total_leave = telat_masuk + ',' + telat_masuk_setelah_istirahat + ',' + telat_pulang_lebih_cepat + ',' + ijin

      att.work_duration = (totalShiftTimeCheckout - totalShiftTimeCheckin) - (totalShiftTimeEndBreak - totalShiftTimeStartBreak)

      att.shift = shift
      att.detailShift = shift.detailShift[0]
      return await this.repo.update(dto.attendance_id, att)
        // return []



    } catch (error) {
      console.log(error)
      console.log(errorMessage)
    }
  }
}
