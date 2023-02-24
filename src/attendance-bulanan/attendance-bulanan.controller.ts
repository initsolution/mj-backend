import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException } from '@nestjs/common';
import { AttendanceBulananService } from './attendance-bulanan.service';
import { CreateAttendanceBulananDto, CreateManyAttendanceBulananDto } from './dto/create-attendance-bulanan.dto';
import { UpdateAttendanceBulananDto } from './dto/update-attendance-bulanan.dto';
import { AttendanceBulanan } from './entities/attendance-bulanan.entity';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudRequest, Override, ParsedBody, ParsedRequest } from '@nestjsx/crud';
import { EmployeeService } from 'src/employee/employee.service';
import { hitungTelat } from 'src/function'

@Crud({
  model: {
    type: AttendanceBulanan
  },
  query: {
    join: {
      employee: {},
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
          throw new HttpException('Duplicate entry detected', 409);
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
            {
              'status': 'error',
              'statusText': 'Employee ' + dataExcel.employee.id + ' not Found',

            },
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

          const shiftTimeStartBreak = employeeShift.shift.detailShift[0].start_break != null ? employeeShift.shift.detailShift[0].start_break.split(':') : 0
          const totalShiftTimeStartBreak = employeeShift.shift.detailShift[0].start_break != null ? (parseInt(shiftTimeStartBreak[0]) * 60) + parseInt(shiftTimeStartBreak[1]) : 0
          const shiftTimeEndBreak = employeeShift.shift.detailShift[0].end_break != null ? employeeShift.shift.detailShift[0].end_break.split(':') : 0
          const totalShiftTimeEndBreak = employeeShift.shift.detailShift[0].end_break != null ? (parseInt(shiftTimeEndBreak[0]) * 60) + parseInt(shiftTimeEndBreak[1]) : 0
          let telat_masuk = 0
          let telat_masuk_setelah_istirahat = 0
          let telat_pulang_lebih_cepat = 0
          let ijin = 0



          if (totalShiftTimeCheckout > totalCheckout) {
            let itungTelat = totalShiftTimeCheckout - totalCheckout

            telat_pulang_lebih_cepat = itungTelat
          }

          //hitung ijin
          if (dataExcel.time_end_for_left && dataExcel.time_start_for_left) {
            errorMessage += '\ntimeEndForLeft : ' + dataExcel.time_end_for_left
            const timeEndForLeft = dataExcel.time_end_for_left.split(":")
            errorMessage += '\ntimeStartForLeft : ' + dataExcel.time_start_for_left
            const timeStartForLeft = dataExcel.time_start_for_left.split(":")
            ijin = ((parseInt(timeEndForLeft[0]) * 60) + parseInt(timeEndForLeft[1])) - ((parseInt(timeStartForLeft[0]) * 60) + parseInt(timeStartForLeft[1]))
            console.log(employeeShift.name + '  - ijin : ' + ijin)

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
          if (dataExcel.time_start_for_break && dataExcel.time_end_for_break) {
            errorMessage += '\nshiftTimeStartBreak : ' + employeeShift.shift.detailShift[0].start_break

            errorMessage += '\ntimeCheckStartBreak : ' + dataExcel.time_start_for_break
            const timeCheckStartBreak = dataExcel.time_start_for_break.split(":")
            const totalCheckStartBreak = (parseInt(timeCheckStartBreak[0]) * 60) + parseInt(timeCheckStartBreak[1])

            errorMessage += '\nshiftTimeEndBreak : ' + employeeShift.shift.detailShift[0].end_break

            errorMessage += '\ntimeCheckEndBreak : ' + dataExcel.time_end_for_break
            const timeCheckEndBreak = dataExcel.time_end_for_break.split(":")
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

      throw new HttpException(
        err.message || JSON.stringify(err),
        err.status || err.statusCode || 500,
      );
    }
  }
}
