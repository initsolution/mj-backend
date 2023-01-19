import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpException } from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { ApiTags } from '@nestjs/swagger';
import { CreateManyDto, Crud, CrudController, CrudRequest, Override, ParsedBody, ParsedRequest } from '@nestjsx/crud';
import { EmployeeService } from 'src/employee/employee.service';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto, CreateManyAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Attendance } from './entities/attendance.entity';

@Crud({
  model: {
    type: Attendance
  },
  query: {
    join: {
      employee: {
        eager: true
      }
    }
  },
  dto: {
    create: CreateAttendanceDto,
    update: UpdateAttendanceDto
  }
})

@ApiTags('Attendance')
@Controller('attendance')
export class AttendanceController implements CrudController<Attendance> {
  constructor(
    public service: AttendanceService,
    private readonly employeeService: EmployeeService

  ) { }

  get base(): CrudController<Attendance> {
    return this;
  }

  @Override()
  async createMany(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateManyAttendanceDto,
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
        let att: Attendance
        let totalLeave = 0
        let overtime = 0
        let earlyOvertime = 0
        const dataExcel: any = dto.bulk[index]
        att = dataExcel
        // att.attendance_date = new Date(dataExcel.attendance_date).

        const employeeShift = await this.employeeService.findOne(
          {
            where: {
              id: dataExcel.employee.id,
              shift: {
                detailShift: {
                  days: dataExcel.week_of_day
                }
              }
            },

            select: {
              id: true,
              name: true,
              shift: {
                id: true,
                detailShift: {
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
          let telat_masuk = 0
          let telat_masuk_setelah_istirahat = 0
          let telat_pulang_lebih_cepat = 0
          let ijin = 0

          if (employeeShift.department.id == 1) { // department produksi
            att.work_duration = 0
            //jika perjalanan
            //cari early overtime
            if (dataExcel.attendance_type == 1) {
              errorMessage += '\ntimeArriveHome : ' + dataExcel.time_arrive_home
              const timeArriveHome = dataExcel.time_arrive_home.split(':')
              const totalTimeArriveHome = (parseInt(timeArriveHome[0]) * 60) + parseInt(timeArriveHome[1])
              let sisaHasil = 0
              if (totalShiftTimeCheckout > totalCheckout) {
                sisaHasil = Math.floor((totalTimeArriveHome - totalShiftTimeCheckout) / 30)
              } else {
                sisaHasil = Math.floor((totalTimeArriveHome - totalCheckout) / 30)
              }

              earlyOvertime += sisaHasil * 30
            }

            //hitung overtime
            //990 -> 16:30:00
            if (totalCheckout > totalShiftTimeCheckout + 30) {
              let getDiff = totalCheckout - totalShiftTimeCheckout
              var sisaHasil = Math.floor(getDiff / 30)
              overtime = sisaHasil * 30
            }
            att.overtime = overtime

            //hitung early overtime
            // jika shiftcheckin lebih besar dari checkin -> early OT



            if (totalShiftTimeCheckin - 30 > totalCheckIn) {
              let getDiff = totalShiftTimeCheckin - totalCheckIn
              var sisaHasil = Math.floor(getDiff / 30)
              earlyOvertime += sisaHasil * 30
            }
            att.early_overtime = earlyOvertime

            //hitung ijin
            if (dataExcel.time_end_for_left && dataExcel.time_start_for_left) {
              errorMessage += '\ntimeEndForLeft : ' + dataExcel.time_end_for_left
              const timeEndForLeft = dataExcel.time_end_for_left.split(":")
              errorMessage += '\ntimeStartForLeft : ' + dataExcel.time_start_for_left
              const timeStartForLeft = dataExcel.time_start_for_left.split(":")
              ijin = ((parseInt(timeEndForLeft[0]) * 60) + parseInt(timeEndForLeft[1])) - ((parseInt(timeStartForLeft[0]) * 60) + parseInt(timeStartForLeft[1]))
              console.log(employeeShift.name +'  - ijin : '+ijin)
              
              if (Math.floor(ijin%30) >0){
                
                let temp = Math.floor(ijin/30)+1
                console.log(employeeShift.name +'  - ijin temp: '+temp)
                ijin = temp*30
                console.log(employeeShift.name +'  - ijin after : '+ijin)
              }
            }


            //hitung telat
            //telat masuk
            if (totalCheckIn > totalShiftTimeCheckin) {
              let itungTelat = totalCheckIn - totalShiftTimeCheckin
              if (itungTelat <= 5) {
                telat_masuk = itungTelat
              } else if (itungTelat > 5) {
                console.log(Math.floor(itungTelat / 30))

                ijin =+ this.hitungTelat(itungTelat)
                // ijin = Math.floor(itungTelat / 30)
              }
              // telat_masuk = totalCheckIn - totalShiftTimeCheckin <= 5 ? totalCheckIn - totalShiftTimeCheckin : 30 
              // totalLeave += (totalCheckIn - totalShiftTimeCheckin)
            }

            //telat pulang
            if (totalShiftTimeCheckout > totalCheckout) {
              let itungTelat = totalShiftTimeCheckout - totalCheckout
              if (itungTelat <= 5) {
                telat_pulang_lebih_cepat = itungTelat
              } else if (itungTelat > 5) {
                console.log(Math.floor(itungTelat / 30))

                ijin =+ this.hitungTelat(itungTelat)
                // ijin = Math.floor(itungTelat / 30)

              }

              // totalLeave += (totalShiftTimeCheckout - totalCheckout)
            }
            // console.log(dataExcel.time_start_for_break)  
            //telat istirahat 
            if (dataExcel.time_start_for_break && dataExcel.time_end_for_break) {
              errorMessage += '\nshiftTimeStartBreak : ' + employeeShift.shift.detailShift[0].start_break
              const shiftTimeStartBreak = employeeShift.shift.detailShift[0].start_break.split(':')
              const totalShiftTimeStartBreak = (parseInt(shiftTimeStartBreak[0]) * 60) + parseInt(shiftTimeStartBreak[1])
              errorMessage += '\ntimeCheckStartBreak : ' + dataExcel.time_start_for_break
              const timeCheckStartBreak = dataExcel.time_start_for_break.split(":")
              const totalCheckStartBreak = (parseInt(timeCheckStartBreak[0]) * 60) + parseInt(timeCheckStartBreak[1])

              errorMessage += '\nshiftTimeEndBreak : ' + employeeShift.shift.detailShift[0].end_break
              const shiftTimeEndBreak = employeeShift.shift.detailShift[0].end_break.split(':')
              const totalShiftTimeEndBreak = (parseInt(shiftTimeEndBreak[0]) * 60) + parseInt(shiftTimeEndBreak[1])
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
                if (itungTelat <= 5) {
                  telat_masuk_setelah_istirahat = itungTelat
                } else if (itungTelat > 5) {

                  ijin =+ this.hitungTelat(itungTelat)
                  // ijin = Math.floor(itungTelat / 30)

                }
                // telat_masuk_setelah_istirahat = totalCheckEndBreak - totalShiftTimeEndBreak <= 5 ? totalCheckEndBreak - totalShiftTimeEndBreak : 30
                // totalLeave += (totalCheckEndBreak - totalShiftTimeEndBreak)
              }
            }

            att.total_leave = telat_masuk + ',' + telat_masuk_setelah_istirahat + ',' + telat_pulang_lebih_cepat + ',' + ijin

          }


        } else {
          errorMessage += 'error dataExcel.time_check_out null || dataExcel.time_check_in  null'
        }
        errorMessage += '\n'

        // attendanceFinal.push(att)
        attendanceFinal.bulk.push(att)
      }

      // console.log(attendanceFinal)
      // var fs = require('fs');
      // fs.writeFileSync("log.txt", errorMessage);

      const createAttendance = await this.base.createManyBase(req, attendanceFinal)
      console.log('masuk end')
      return createAttendance
      // return attendanceFinal
    } catch (err) {
      console.log(err)
      // console.log(errorMessage)
      // throw new HttpException(
      //   {
      //     statusError : err,
      //     message : errorMessage
      //   },
      //   500
      // );
      throw new HttpException(
        err.message || JSON.stringify(err),
        err.status || err.statusCode || 500,
      );
    }
  }

  @Delete('deleteAll')
  async deleteAll() {
    return this.service.delateAll()
  }

  hitungTelat(itungtelat) {
    if (Math.floor(itungtelat % 30) == 0) {
      return itungtelat
    } else {
      return itungtelat - (Math.floor(itungtelat % 30)) + 30
    }
  }


  // @Post('/checkAttendance')
  // async checkAttendance(
  //   @ParsedRequest() req: CrudRequest,
  //   // @ParsedBody() dto: CreateManyAttendanceDto,
  //   @ParsedBody() dto: CreateManyDto<Attendance>,
  //   // @Body() dto: CreateManyAttendanceDto,
  // ) {
  //   try {
  //     console.log(dto)
  //     let attendanceFinal: any = {
  //       bulk: []
  //     }
  //     // let attendanceFinal : any = []
  //     // const inputDataExcel = await dto.bulk

  //     // attendanceFinal.bulk = dto.bulk.map((el: any) =>{

  //     // })

  //     for (const index in dto.bulk) {
  //       let att: Attendance
  //       let totalLeave = 0
  //       let overtime = 0
  //       let earlyOvertime = 0
  //       const dataExcel: any = dto.bulk[index]
  //       att = dataExcel
  //       // att.attendance_date = dataExcel.attendance_date
  //       const employeeShift = await this.employeeService.findOne(
  //         {
  //           where: {
  //             id: dataExcel.employee.id,
  //             shift: {
  //               detailShift: {
  //                 days: dataExcel.week_of_day
  //               }
  //             }
  //           },

  //           select: {
  //             id: true,
  //             name: true,
  //             shift: {
  //               id: true,
  //               detailShift: {
  //                 days: true,
  //                 start: true,
  //                 end: true,
  //                 start_break: true,
  //                 end_break: true,
  //                 break_duration_h: true,
  //                 break_duration_m: true,
  //               }
  //             },
  //             department: {
  //               id: true,
  //               name: true,
  //             }
  //           },
  //           relations: [
  //             'department',
  //             'shift',
  //             'shift.detailShift'
  //           ]

  //         }
  //       )
  //       if (employeeShift == null) {
  //         return {
  //           'status': 'error',
  //           'status_code': HttpStatus.NOT_FOUND
  //         }
  //       }

  //       att.employee.name = employeeShift.name
  //       const shiftTimeCheckout = employeeShift.shift.detailShift[0].end.split(":")
  //       const totalShiftTimeCheckout = (parseInt(shiftTimeCheckout[0]) * 60) + parseInt(shiftTimeCheckout[1])  // + toleransi 30
  //       const timeCheckOut = dataExcel.time_check_out.split(":")
  //       const totalCheckout = (parseInt(timeCheckOut[0]) * 60) + parseInt(timeCheckOut[1])

  //       const shiftTimeCheckin = employeeShift.shift.detailShift[0].start.split(":")
  //       const totalShiftTimeCheckin = (parseInt(shiftTimeCheckin[0]) * 60) + parseInt(shiftTimeCheckin[1])  // - toleransi 30
  //       const timeCheckIn = dataExcel.time_check_in.split(":")
  //       const totalCheckIn = (parseInt(timeCheckIn[0]) * 60) + parseInt(timeCheckIn[1])


  //       if (employeeShift.department.id == 1) { // department produksi
  //         att.work_duration = 0
  //         //jika perjalanan
  //         //cari early overtime
  //         if (dataExcel.attendance_type == 1) {
  //           const timeArriveHome = dataExcel.time_arrive_home.split(':')
  //           const totalTimeArriveHome = (parseInt(timeArriveHome[0]) * 60) + parseInt(timeArriveHome[1])
  //           var sisaHasil = Math.floor((totalTimeArriveHome - totalCheckout) / 30)
  //           earlyOvertime += sisaHasil * 30
  //         }

  //         //hitung overtime
  //         //990 -> 16:30:00
  //         if (totalCheckout > totalShiftTimeCheckout + 30) {
  //           let getDiff = totalCheckout - totalShiftTimeCheckout
  //           var sisaHasil = Math.floor(getDiff / 30)
  //           overtime = sisaHasil * 30
  //         }
  //         att.overtime = overtime

  //         //hitung early overtime
  //         // jika shiftcheckin lebih besar dari checkin -> early OT



  //         if (totalShiftTimeCheckin - 30 > totalCheckIn) {
  //           let getDiff = totalShiftTimeCheckin - totalCheckIn
  //           var sisaHasil = Math.floor(getDiff / 30)
  //           earlyOvertime += sisaHasil * 30
  //         }
  //         att.early_overtime = earlyOvertime

  //         //hitung ijin
  //         if (dataExcel.time_end_for_left && dataExcel.time_start_for_left) {
  //           const timeEndForLeft = dataExcel.time_end_for_left.split(":")
  //           const timeStartForLeft = dataExcel.time_start_for_left.split(":")
  //           totalLeave = ((parseInt(timeEndForLeft[0]) * 60) + parseInt(timeEndForLeft[1])) - ((parseInt(timeStartForLeft[0]) * 60) + parseInt(timeStartForLeft[1]))
  //         }


  //         //hitung telat
  //         //telat masuk
  //         if (totalCheckIn > totalShiftTimeCheckin) {
  //           totalLeave += (totalCheckIn - totalShiftTimeCheckin)
  //         }

  //         //telat pulang
  //         if (totalShiftTimeCheckout > totalCheckout) {
  //           totalLeave += (totalShiftTimeCheckout - totalCheckout)
  //         }
  //         // console.log(dataExcel.time_start_for_break)  
  //         //telat istirahat 
  //         if (dataExcel.time_start_for_break && dataExcel.time_end_for_break) {
  //           const shiftTimeStartBreak = employeeShift.shift.detailShift[0].start_break.split(':')
  //           const totalShiftTimeStartBreak = (parseInt(shiftTimeStartBreak[0]) * 60) + parseInt(shiftTimeStartBreak[1])
  //           const timeCheckStartBreak = dataExcel.time_start_for_break.split(":")
  //           const totalCheckStartBreak = (parseInt(timeCheckStartBreak[0]) * 60) + parseInt(timeCheckStartBreak[1])

  //           const shiftTimeEndBreak = employeeShift.shift.detailShift[0].end_break.split(':')
  //           const totalShiftTimeEndBreak = (parseInt(shiftTimeEndBreak[0]) * 60) + parseInt(shiftTimeEndBreak[1])
  //           const timeCheckEndBreak = dataExcel.time_end_for_break.split(":")
  //           const totalCheckEndBreak = (parseInt(timeCheckEndBreak[0]) * 60) + parseInt(timeCheckEndBreak[1])

  //           //start break
  //           if (totalShiftTimeStartBreak > totalCheckStartBreak) {
  //             totalLeave += (totalShiftTimeStartBreak - totalCheckStartBreak)
  //           }

  //           //end break
  //           if (totalCheckEndBreak > totalShiftTimeEndBreak) {
  //             totalLeave += (totalCheckEndBreak - totalShiftTimeEndBreak)
  //           }
  //         }

  //         att.total_leave = totalLeave + ''

  //       }


  //       // attendanceFinal.push(att)
  //       attendanceFinal.bulk.push(att)
  //     }

  //     console.log(attendanceFinal)
  //     // const createAttendance = await this.service.customCreateMany(attendanceFinal)
  //     const createAttendance = await this.base.createManyBase(req, attendanceFinal)
  //     return createAttendance
  //   } catch (err) {
  //     console.log(err)
  //     throw new HttpException(
  //       err.message || err,
  //       err.statusCode || err.status || 500,
  //     );
  //   }
  // }

}
