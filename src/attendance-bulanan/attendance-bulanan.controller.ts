import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException } from '@nestjs/common';
import { AttendanceBulananService } from './attendance-bulanan.service';
import { CreateAttendanceBulananDto, CreateManyAttendanceBulananDto } from './dto/create-attendance-bulanan.dto';
import { UpdateAttendanceBulananDto } from './dto/update-attendance-bulanan.dto';
import { AttendanceBulanan } from './entities/attendance-bulanan.entity';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudRequest, Override, ParsedBody, ParsedRequest } from '@nestjsx/crud';
import { EmployeeService } from 'src/employee/employee.service';
import { hitungTelat } from 'src/function'
import { UpdateAttendanceHelperByShift } from 'src/attendance-helper/dto/update-attendance-helper-by-shift.dto';

@Crud({
  model: {
    type: AttendanceBulanan
  },
  query: {
    join: {
      employee: {
        eager : true
      },
      shift: {}
    }
  },
  dto: {
    create: CreateAttendanceBulananDto,
    update: UpdateAttendanceBulananDto
  }
})

@ApiTags('Attendance-Bulanan')
@Controller('attendance-bulanan')
export class AttendanceBulananController implements CrudController<AttendanceBulanan> {
  constructor(public service: AttendanceBulananService,
    private readonly employeeService: EmployeeService) { }
  get base(): CrudController<AttendanceBulanan> {
    return this;
  }
  @Get('/customGetAttendance')
  async customGetAttendance() {
    return this.service.getCustomAttendance()
  }

  @Patch('/updateAttendanceByShift')
  async updateAttendanceByShift(@Body() dto: UpdateAttendanceHelperByShift) {
    // console.log('update attendance by shift')
    return this.service.updateAttendanceByShift(dto)
  }

  @Delete('deleteByRangeDate/:start_date/:end_date')
  async deleteByRangeDate(
    @Param('start_date') start_date : string,
    @Param('end_date') end_date : string,
  ) {
    return this.service.deleteByRangeDate(start_date, end_date)
  }

  @Override()
  async createMany(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateManyAttendanceBulananDto,
  ) {
    let errorMessage
    try {

      // console.log(dto)
      let attendanceFinal: any = {
        bulk: []
      }
      // let attendanceFinal : any = []
      // const inputDataExcel = await dto.bulk

      // attendanceFinal.bulk = dto.bulk.map((el: any) =>{

      // })

      for (const index in dto.bulk) {
        let att: AttendanceBulanan
        let totalLeave = 0
        let overtime = 0
        let earlyOvertime = 0
        const dataExcel: any = dto.bulk[index]
        att = dataExcel
        // att.attendance_date = new Date(dataExcel.attendance_date).
        const cekData: AttendanceBulanan[] = await this.service.checkForDuplicate(dataExcel.employee.id, dataExcel.attendance_date)
        if (cekData && cekData.length > 0) {
          throw new HttpException('Duplicate entry detected ' +dataExcel.employee.id + ' date : '+dataExcel.attendance_date, 409);
        }
        const employeeShift = await this.employeeService.findOne(
          {
            where: {
              id: dataExcel.employee.id,
              shift: {
                detailShift: {
                  days: dataExcel.week_of_day
                }
              },
              active: 1,
            },

            select: {
              id: true,
              name: true,
              shift: {
                id: true,
                detailShift: {
                  id: true,
                  work_hours: true,
                  break_hours: true,
                  days: true,
                  start: true,
                  end: true,
                  start_break: true,
                  end_break: true,
                  break_duration_h: true,
                  break_duration_m: true,
                }
              },
              department: {
                id: true,
                name: true,
              }
            },
            relations: [
              'department',
              'shift',
              'shift.detailShift'
            ]

          }
        )
        if (employeeShift == null) {
          throw new HttpException(
            // {
            //   'status': 'error',
            //   'statusText': 'Employee ' + dataExcel.employee.id + ' not Found',

            // }
            'Employee ' + dataExcel.employee.id + ' not Found'
            ,
            500
          );
        }
        errorMessage = 'name : ' + employeeShift.name + '\nattendance_date : ' + dataExcel.attendance_date

        att.employee.name = employeeShift.name
        att.shift = employeeShift.shift
        att.detailShift = employeeShift.shift.detailShift[0]
        att.week_of_day = dataExcel.week_of_day
        // console.log(dataExcel)
        if (dataExcel.time_check_out != null || dataExcel.time_check_in != null) {
          att.work_hours = employeeShift.shift.detailShift[0].work_hours
          att.break_hours = employeeShift.shift.detailShift[0].break_hours

          errorMessage += '\nshiftTimeCheckout : ' + employeeShift.shift.detailShift[0].end
          const shiftTimeCheckout = employeeShift.shift.detailShift[0].end.split(":")
          const totalShiftTimeCheckout = (parseInt(shiftTimeCheckout[0]) * 60) + parseInt(shiftTimeCheckout[1])  // + toleransi 30
          errorMessage += '\ntimeCheckOut : ' + dataExcel.time_check_out
          const timeCheckOut = dataExcel.time_check_out.split(":")
          const totalCheckout = (parseInt(timeCheckOut[0]) * 60) + parseInt(timeCheckOut[1])

          errorMessage += '\nshiftTimeCheckin : ' + employeeShift.shift.detailShift[0].start
          const shiftTimeCheckin = employeeShift.shift.detailShift[0].start.split(":")
          const totalShiftTimeCheckin = (parseInt(shiftTimeCheckin[0]) * 60) + parseInt(shiftTimeCheckin[1])  // - toleransi 30
          errorMessage += '\ntimeCheckIn : ' + dataExcel.time_check_in
          const timeCheckIn = dataExcel.time_check_in.split(":")
          const totalCheckIn = (parseInt(timeCheckIn[0]) * 60) + parseInt(timeCheckIn[1])

          // const shiftTimeStartBreak = employeeShift.shift.detailShift[0].start_break != null ? employeeShift.shift.detailShift[0].start_break.split(':') : 0
          // const totalShiftTimeStartBreak = employeeShift.shift.detailShift[0].start_break != null ? (parseInt(shiftTimeStartBreak[0]) * 60) + parseInt(shiftTimeStartBreak[1]) : 0
          // const shiftTimeEndBreak = employeeShift.shift.detailShift[0].end_break != null ? employeeShift.shift.detailShift[0].end_break.split(':') : 0
          // const totalShiftTimeEndBreak = employeeShift.shift.detailShift[0].end_break != null ? (parseInt(shiftTimeEndBreak[0]) * 60) + parseInt(shiftTimeEndBreak[1]) : 0
          const totalBreakDuration = employeeShift.shift.detailShift[0].break_duration_m

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
            if (dataExcel.time_start_for_break_1 && dataExcel.time_end_for_break_1) {
              const timeCheckStartBreak = dataExcel.time_start_for_break_1.split(":")
              const totalCheckStartBreak = (parseInt(timeCheckStartBreak[0]) * 60) + parseInt(timeCheckStartBreak[1])

              const timeCheckEndBreak = dataExcel.time_end_for_break_1.split(":")
              const totalCheckEndBreak = (parseInt(timeCheckEndBreak[0]) * 60) + parseInt(timeCheckEndBreak[1])
              let breakdurationtemp = totalCheckEndBreak - totalCheckStartBreak
              breakDurationActual = 60
              if(breakdurationtemp <= 60){}
              else if (breakdurationtemp <= 90) {
                telat_masuk_setelah_istirahat = breakdurationtemp - 60
              } else if(breakdurationtemp > 90){
                ijin += breakdurationtemp - 60
              }
            }else{
              // breakDurationActual = 0
              if(ijin >0)
              {
                ijin -= breakDurationActual
                ijin = ijin <0 ? 0 : ijin  
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
            if (dataExcel.time_start_for_break_1 && dataExcel.time_end_for_break_1 && dataExcel.time_start_for_break_2 && dataExcel.time_end_for_break_2) {
              const timeCheckStartBreak1 = dataExcel.time_start_for_break_1.split(":")
              const totalCheckStartBreak1 = (parseInt(timeCheckStartBreak1[0]) * 60) + parseInt(timeCheckStartBreak1[1])

              const timeCheckEndBreak1 = dataExcel.time_end_for_break_1.split(":")
              const totalCheckEndBreak1 = (parseInt(timeCheckEndBreak1[0]) * 60) + parseInt(timeCheckEndBreak1[1])
              let breakdurationtemp1 = totalCheckEndBreak1 - totalCheckStartBreak1
              
              const timeCheckStartBreak2 = dataExcel.time_start_for_break_2.split(":")
              const totalCheckStartBreak2 = (parseInt(timeCheckStartBreak2[0]) * 60) + parseInt(timeCheckStartBreak2[1])

              const timeCheckEndBreak2 = dataExcel.time_end_for_break_2.split(":")
              const totalCheckEndBreak2 = (parseInt(timeCheckEndBreak2[0]) * 60) + parseInt(timeCheckEndBreak2[1])
              let breakdurationtemp2 = totalCheckEndBreak2 - totalCheckStartBreak2
              
              let breakdurationtemp = breakdurationtemp1 + breakdurationtemp2
              breakDurationActual = 120
              if(breakdurationtemp <= 120){
                
              } else if (breakdurationtemp <= 150) {
                telat_masuk_setelah_istirahat = breakdurationtemp - 120
              } else if(breakdurationtemp > 150){
                ijin += breakdurationtemp - 120
              }
            }else if(dataExcel.time_start_for_break_1 && dataExcel.time_end_for_break_1){
              const timeCheckStartBreak1 = dataExcel.time_start_for_break_1.split(":")
              const totalCheckStartBreak1 = (parseInt(timeCheckStartBreak1[0]) * 60) + parseInt(timeCheckStartBreak1[1])

              const timeCheckEndBreak1 = dataExcel.time_end_for_break_1.split(":")
              const totalCheckEndBreak1 = (parseInt(timeCheckEndBreak1[0]) * 60) + parseInt(timeCheckEndBreak1[1])
              let breakdurationtemp = totalCheckEndBreak1 - totalCheckStartBreak1
              breakDurationActual = 120
              if(breakdurationtemp <= 120){  } 
              else if (breakdurationtemp <= 150) {
                telat_masuk_setelah_istirahat = breakdurationtemp - 120
              } else if(breakdurationtemp > 150){
                ijin += breakdurationtemp - 120
              }
            }else{
              // breakDurationActual = 0
              if(ijin >0)
              {
                ijin -= breakDurationActual
                ijin = ijin <0 ? 0 : ijin  
              }
              // excel di modif mandor
            }
            
            
            
          }

          // console.log(dataExcel.time_start_for_break)  
          //telat istirahat 







          if (dataExcel.time_start_for_break_2 && dataExcel.time_end_for_break_2) {
            const timeCheckStartBreak = dataExcel.time_start_for_break_1.split(":")
            const totalCheckStartBreak = (parseInt(timeCheckStartBreak[0]) * 60) + parseInt(timeCheckStartBreak[1])

            const timeCheckEndBreak = dataExcel.time_end_for_break_1.split(":")
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
          if (dataExcel.time_end_for_left_1 && dataExcel.time_start_for_left_1) {
            errorMessage += '\ntimeEndForLeft : ' + dataExcel.time_end_for_left_1
            const timeEndForLeft = dataExcel.time_end_for_left_1.split(":")
            errorMessage += '\ntimeStartForLeft : ' + dataExcel.time_start_for_left_1
            const timeStartForLeft = dataExcel.time_start_for_left_1.split(":")
            ijin += ((parseInt(timeEndForLeft[0]) * 60) + parseInt(timeEndForLeft[1])) - ((parseInt(timeStartForLeft[0]) * 60) + parseInt(timeStartForLeft[1]))
          }

          if (dataExcel.time_end_for_left_2 && dataExcel.time_start_for_left_2) {
            errorMessage += '\ntimeEndForLeft : ' + dataExcel.time_end_for_left_2
            const timeEndForLeft = dataExcel.time_end_for_left_2.split(":")
            errorMessage += '\ntimeStartForLeft : ' + dataExcel.time_start_for_left_2
            const timeStartForLeft = dataExcel.time_start_for_left_2.split(":")
            ijin += (((parseInt(timeEndForLeft[0]) * 60) + parseInt(timeEndForLeft[1])) - ((parseInt(timeStartForLeft[0]) * 60) + parseInt(timeStartForLeft[1])))
          }

          if (dataExcel.time_end_for_left_3 && dataExcel.time_start_for_left_3) {
            errorMessage += '\ntimeEndForLeft : ' + dataExcel.time_end_for_left_3
            const timeEndForLeft = dataExcel.time_end_for_left_3.split(":")
            errorMessage += '\ntimeStartForLeft : ' + dataExcel.time_start_for_left_3
            const timeStartForLeft = dataExcel.time_start_for_left_3.split(":")
            ijin += (((parseInt(timeEndForLeft[0]) * 60) + parseInt(timeEndForLeft[1])) - ((parseInt(timeStartForLeft[0]) * 60) + parseInt(timeStartForLeft[1])))
          }
          // ijin minimal 30 menit
          // potong durasi istirahat jika durasi kerja di detail shift dikurangi durasi istirahat di bagi 2
          // ijin - durasi istirahat jika (total jam kerja shift - 1 jam /2) > ijin 
          //           1. akan dihitung ijin jika telat melebihi 30 menit (tanpa pembulatan)
          // 2. jika lama ijin melebihi setengah hari kerja, maka lama ijin dipotong durasi istirahat
            
          att.lembur = lembur
          att.total_leave = telat_masuk + ',' + telat_masuk_setelah_istirahat + ',' + telat_pulang_lebih_cepat + ',' + ijin

          // att.work_duration = (totalShiftTimeCheckout - totalShiftTimeCheckin) - (totalShiftTimeEndBreak - totalShiftTimeStartBreak)
          att.work_duration = ((totalShiftTimeCheckout - totalShiftTimeCheckin) - totalBreakDuration) - (telat_masuk+ telat_masuk_setelah_istirahat + telat_pulang_lebih_cepat) - ijin - breakDurationActual


        } else {
          errorMessage += 'error dataExcel.time_check_out null || dataExcel.time_check_in  null'
        }
        errorMessage += '\n'

        console.log(errorMessage)
        // attendanceFinal.push(att)
        attendanceFinal.bulk.push(att)
      }


      const createAttendance = await this.base.createManyBase(req, attendanceFinal)
      return createAttendance
      // return attendanceFinal
    } catch (err) {
      console.log(err);

      throw new HttpException(
        err.message || JSON.stringify(err),
        err.status || err.statusCode || 500,
      );
    }
  }
}
