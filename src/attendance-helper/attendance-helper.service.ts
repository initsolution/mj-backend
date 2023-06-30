import { Injectable } from '@nestjs/common';
import { CreateAttendanceHelperDto } from './dto/create-attendance-helper.dto';
import { UpdateAttendanceHelperDto } from './dto/update-attendance-helper.dto';
import { AttendanceHelper } from './entities/attendance-helper.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import * as moment from 'moment';
import { UpdateAttendanceHelperByShift } from './dto/update-attendance-helper-by-shift.dto';
import { Shift } from 'src/shift/entities/shift.entity';
import { ShiftService } from 'src/shift/shift.service';
import { hitungTelat } from 'src/function';

@Injectable()
export class AttendanceHelperService extends TypeOrmCrudService<AttendanceHelper> {
  constructor(@InjectRepository(AttendanceHelper) repo,
    private readonly shiftService: ShiftService,
  ) {
    super(repo)
  }

  async deleteByRangeDate(start_date, end_date){
    return await this.repo.createQueryBuilder('AttendanceHelper')
      .delete()
      .where('attendance_date BETWEEN :start_date AND :end_date', {
        start_date : start_date,
        end_date : end_date
      }).execute()
    
  }

  async getCustomAttendance(): Promise<any> {
    try {
      const dateNow = moment(new Date())
        // .add(-1, 'days')
        .format("YYYY-MM-DD");
      let queryBuilder: any = await
        this.repo.createQueryBuilder('AttendanceHelper')
          .leftJoinAndSelect('AttendanceHelper.employee', 'employee')
          .leftJoinAndSelect('AttendanceHelper.shift', 'shift')
          .leftJoinAndSelect('AttendanceHelper.detailShift', 'detailShift')
          .where('(DATE(AttendanceHelper.created_at) = :now)', { now: dateNow })
          // .where('DATE(AttendanceProduksi.created_at) = '+dateNow)
          .orderBy(`employee.name`, `ASC`)
          .addOrderBy('AttendanceHelper.attendance_date', 'ASC')
      return await queryBuilder.getMany()
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async checkForDuplicate(employeeId: string, attendance_date: string): Promise<AttendanceHelper[]> {
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

  async updateAttendanceByShift(dto: UpdateAttendanceHelperByShift) {
    let errorMessage: string = ''
    try {
      let att: AttendanceHelper = await this.repo.findOne(
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
      
      att.work_hours = shift.detailShift[0].work_hours
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


      // department helper
      att.work_duration = 0

      if (totalShiftTimeCheckout > totalCheckout) {
        let itungTelat = totalShiftTimeCheckout - totalCheckout
        if (itungTelat <= 5) {
          telat_pulang_lebih_cepat = itungTelat
        } else if (itungTelat > 5) {
          // console.log(Math.floor(itungTelat / 30))

          ijin = + hitungTelat(itungTelat)
          // ijin = Math.floor(itungTelat / 30)

        }

        // totalLeave += (totalShiftTimeCheckout - totalCheckout)
      }

      //hitung ijin
      if (att.time_end_for_left && att.time_start_for_left) {
        errorMessage += '\ntimeEndForLeft : ' + att.time_end_for_left
        const timeEndForLeft = att.time_end_for_left.split(":")
        errorMessage += '\ntimeStartForLeft : ' + att.time_start_for_left
        const timeStartForLeft = att.time_start_for_left.split(":")
        ijin = ((parseInt(timeEndForLeft[0]) * 60) + parseInt(timeEndForLeft[1])) - ((parseInt(timeStartForLeft[0]) * 60) + parseInt(timeStartForLeft[1]))
        // console.log(att.employee.id + '  - ijin : ' + ijin)

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

          if (itungTelat <= 5) {
            telat_masuk = itungTelat
          } else if (itungTelat > 5) {
            // console.log(Math.floor(itungTelat / 30))

            ijin = + hitungTelat(itungTelat)
            // ijin = Math.floor(itungTelat / 30)
          }
          // telat_masuk = totalCheckIn - totalShiftTimeCheckin <= 5 ? totalCheckIn - totalShiftTimeCheckin : 30 
          // totalLeave += (totalCheckIn - totalShiftTimeCheckin)
        } else if (totalCheckIn >= totalShiftTimeStartBreak) {
          if (totalCheckIn <= totalShiftTimeEndBreak) {
            ijin += 240
          } else {
            ijin = + hitungTelat(itungTelat - 60)
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
          if (itungTelat <= 5) {
            telat_masuk_setelah_istirahat = itungTelat
          } else if (itungTelat > 5) {

            ijin = + hitungTelat(itungTelat)
            // ijin = Math.floor(itungTelat / 30)

          }
          // telat_masuk_setelah_istirahat = totalCheckEndBreak - totalShiftTimeEndBreak <= 5 ? totalCheckEndBreak - totalShiftTimeEndBreak : 30
          // totalLeave += (totalCheckEndBreak - totalShiftTimeEndBreak)
        }
      }

      att.total_leave = telat_masuk + ',' + telat_masuk_setelah_istirahat + ',' + telat_pulang_lebih_cepat + ',' + ijin
      // console.log(errorMessage)
      att.shift = shift
      att.detailShift = shift.detailShift[0]
      return await this.repo.update(dto.attendance_id, att)
        // return []



    } catch (error) {
      // console.log(error)
      // console.log(errorMessage)
    }
  }
}