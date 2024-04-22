import { Injectable } from '@nestjs/common';
import { CreateAttendanceBulananDto } from './dto/create-attendance-bulanan.dto';
import { UpdateAttendanceBulananDto } from './dto/update-attendance-bulanan.dto';
import { AttendanceBulanan } from './entities/attendance-bulanan.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import moment from "moment"
import { UpdateAttendanceBulananByShift } from './dto/update-attendance-bulanan-by-shift.dto';
import { ShiftService } from 'src/shift/shift.service';
import { Shift } from 'src/shift/entities/shift.entity';

@Injectable()
export class AttendanceBulananService extends TypeOrmCrudService<AttendanceBulanan> {
  constructor(@InjectRepository(AttendanceBulanan) repo,
    private readonly shiftService: ShiftService,
  ) {
    super(repo)
  }

  async deleteByRangeDate(start_date, end_date){
    return await this.repo.createQueryBuilder('AttendanceBulanan')
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
        this.repo.createQueryBuilder('AttendanceBulanan')
          .leftJoinAndSelect('AttendanceBulanan.employee', 'employee')
          .leftJoinAndSelect('AttendanceBulanan.shift', 'shift')
          .where('(DATE(AttendanceBulanan.created_at) = :now)', { now: dateNow })
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
      att.work_hours = shift.detailShift[0].work_hours

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
      const totalBreakDuration = shift.detailShift[0].break_duration_m
      let telat_masuk = 0
      let telat_masuk_setelah_istirahat = 0
      let telat_pulang_lebih_cepat = 0
      let ijin = 0
      let lembur = 0
      let breakDurationActual = 0

      const checkLemburPulang = totalShiftTimeCheckout + 60

      //telat pulang
      if (totalShiftTimeCheckout > totalCheckout) {
        let itungTelat = totalShiftTimeCheckout - totalCheckout
        if (itungTelat > 30) {
          ijin += itungTelat
        } else {
          telat_pulang_lebih_cepat = itungTelat
        }
      } else if (totalCheckout >= checkLemburPulang) {
        lembur += (totalCheckout - totalShiftTimeCheckout)
      }

      //hitung telat
      //telat masuk sebelum jam istirahat
      if (totalCheckIn > totalShiftTimeCheckin) {
        let itungTelat = totalCheckIn - totalShiftTimeCheckin
        if (itungTelat > 30) {
          ijin += itungTelat
        } else {
          telat_masuk = itungTelat
        }
      } else if (totalCheckIn <= (totalShiftTimeCheckin - 60)) {
        lembur += totalShiftTimeCheckin - totalCheckIn
      }

      if (totalBreakDuration == 60) {
        if (att.time_start_for_break_1 && att.time_end_for_break_1) {
          const timeCheckStartBreak = att.time_start_for_break_1.split(":")
          const totalCheckStartBreak = (parseInt(timeCheckStartBreak[0]) * 60) + parseInt(timeCheckStartBreak[1])

          const timeCheckEndBreak = att.time_end_for_break_1.split(":")
          const totalCheckEndBreak = (parseInt(timeCheckEndBreak[0]) * 60) + parseInt(timeCheckEndBreak[1])
          let breakdurationtemp = totalCheckEndBreak - totalCheckStartBreak
          breakDurationActual = 60
          if (breakdurationtemp <= 60) { }
          else if (breakdurationtemp <= 90) {
            telat_masuk_setelah_istirahat = breakdurationtemp - 60
          } else if (breakdurationtemp > 90) {
            ijin += breakdurationtemp - 60
          }
        } else {
          // breakDurationActual = 0
          if (ijin > 0) {
            ijin -= breakDurationActual
            ijin = ijin < 0 ? 0 : ijin
          }
        }
        // if (totalCheckEndBreak - totalCheckStartBreak > totalBreakDuration) {

        //   // let itungTelat = totalCheckEndBreak - totalShiftTimeEndBreak
        //   let itungTelat = (totalCheckEndBreak - totalCheckStartBreak) - totalBreakDuration
        //   if (itungTelat > 30) {
        //     ijin += itungTelat
        //   } else {
        //     telat_masuk_setelah_istirahat = itungTelat
        //   }


        // }
      } else if (totalBreakDuration == 120) {
        if (att.time_start_for_break_1 && att.time_end_for_break_1 && att.time_start_for_break_2 && att.time_end_for_break_2) {
          const timeCheckStartBreak1 = att.time_start_for_break_1.split(":")
          const totalCheckStartBreak1 = (parseInt(timeCheckStartBreak1[0]) * 60) + parseInt(timeCheckStartBreak1[1])

          const timeCheckEndBreak1 = att.time_end_for_break_1.split(":")
          const totalCheckEndBreak1 = (parseInt(timeCheckEndBreak1[0]) * 60) + parseInt(timeCheckEndBreak1[1])
          let breakdurationtemp1 = totalCheckEndBreak1 - totalCheckStartBreak1

          const timeCheckStartBreak2 = att.time_start_for_break_2.split(":")
          const totalCheckStartBreak2 = (parseInt(timeCheckStartBreak2[0]) * 60) + parseInt(timeCheckStartBreak2[1])

          const timeCheckEndBreak2 = att.time_end_for_break_2.split(":")
          const totalCheckEndBreak2 = (parseInt(timeCheckEndBreak2[0]) * 60) + parseInt(timeCheckEndBreak2[1])
          let breakdurationtemp2 = totalCheckEndBreak2 - totalCheckStartBreak2

          let breakdurationtemp = breakdurationtemp1 + breakdurationtemp2
          breakDurationActual = 120
          if (breakdurationtemp <= 120) {

          } else if (breakdurationtemp <= 150) {
            telat_masuk_setelah_istirahat = breakdurationtemp - 120
          } else if (breakdurationtemp > 150) {
            ijin += breakdurationtemp - 120
          }
        } else if (att.time_start_for_break_1 && att.time_end_for_break_1) {
          const timeCheckStartBreak1 = att.time_start_for_break_1.split(":")
          const totalCheckStartBreak1 = (parseInt(timeCheckStartBreak1[0]) * 60) + parseInt(timeCheckStartBreak1[1])

          const timeCheckEndBreak1 = att.time_end_for_break_1.split(":")
          const totalCheckEndBreak1 = (parseInt(timeCheckEndBreak1[0]) * 60) + parseInt(timeCheckEndBreak1[1])
          let breakdurationtemp = totalCheckEndBreak1 - totalCheckStartBreak1
          breakDurationActual = 120
          if (breakdurationtemp <= 120) { }
          else if (breakdurationtemp <= 150) {
            telat_masuk_setelah_istirahat = breakdurationtemp - 120
          } else if (breakdurationtemp > 150) {
            ijin += breakdurationtemp - 120
          }
        } else {
          // breakDurationActual = 0
          if (ijin > 0) {
            ijin -= breakDurationActual
            ijin = ijin < 0 ? 0 : ijin
          }
          // excel di modif mandor
        }
      }
      
      if (att.time_start_for_break_2 && att.time_end_for_break_2) {
        const timeCheckStartBreak = att.time_start_for_break_1.split(":")
        const totalCheckStartBreak = (parseInt(timeCheckStartBreak[0]) * 60) + parseInt(timeCheckStartBreak[1])

        const timeCheckEndBreak = att.time_end_for_break_1.split(":")
        const totalCheckEndBreak = (parseInt(timeCheckEndBreak[0]) * 60) + parseInt(timeCheckEndBreak[1])

        //start break
        // if (totalShiftTimeStartBreak > totalCheckStartBreak) {
        //   totalLeave += (totalShiftTimeStartBreak - totalCheckStartBreak)
        // }

        //end break
        // if (totalCheckEndBreak - totalCheckStartBreak > totalBreakDuration) {

        //   // let itungTelat = totalCheckEndBreak - totalShiftTimeEndBreak
        //   let itungTelat = (totalCheckEndBreak - totalCheckStartBreak) - totalBreakDuration
        //   if (itungTelat > 30) {
        //     ijin += itungTelat
        //   } else {
        //     telat_masuk_setelah_istirahat = itungTelat
        //   }


        // }
      }
      //hitung ijin
      if (att.time_end_for_left_1 && att.time_start_for_left_1) {
        errorMessage += '\ntimeEndForLeft : ' + att.time_end_for_left_1
        const timeEndForLeft = att.time_end_for_left_1.split(":")
        errorMessage += '\ntimeStartForLeft : ' + att.time_start_for_left_1
        const timeStartForLeft = att.time_start_for_left_1.split(":")
        ijin += ((parseInt(timeEndForLeft[0]) * 60) + parseInt(timeEndForLeft[1])) - ((parseInt(timeStartForLeft[0]) * 60) + parseInt(timeStartForLeft[1]))
      }

      if (att.time_end_for_left_2 && att.time_start_for_left_2) {
        errorMessage += '\ntimeEndForLeft : ' + att.time_end_for_left_2
        const timeEndForLeft = att.time_end_for_left_2.split(":")
        errorMessage += '\ntimeStartForLeft : ' + att.time_start_for_left_2
        const timeStartForLeft = att.time_start_for_left_2.split(":")
        ijin += (((parseInt(timeEndForLeft[0]) * 60) + parseInt(timeEndForLeft[1])) - ((parseInt(timeStartForLeft[0]) * 60) + parseInt(timeStartForLeft[1])))
      }

      if (att.time_end_for_left_3 && att.time_start_for_left_3) {
        errorMessage += '\ntimeEndForLeft : ' + att.time_end_for_left_3
        const timeEndForLeft = att.time_end_for_left_3.split(":")
        errorMessage += '\ntimeStartForLeft : ' + att.time_start_for_left_3
        const timeStartForLeft = att.time_start_for_left_3.split(":")
        ijin += (((parseInt(timeEndForLeft[0]) * 60) + parseInt(timeEndForLeft[1])) - ((parseInt(timeStartForLeft[0]) * 60) + parseInt(timeStartForLeft[1])))
      }

      
      att.lembur = lembur
      att.total_leave = telat_masuk + ',' + telat_masuk_setelah_istirahat + ',' + telat_pulang_lebih_cepat + ',' + ijin

      att.work_duration = (totalShiftTimeCheckout - totalShiftTimeCheckin) - (totalShiftTimeEndBreak - totalShiftTimeStartBreak)

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
