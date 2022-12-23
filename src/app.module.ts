import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeeModule } from './employee/employee.module';
import { DepartmentModule } from './department/department.module';
import { AreaModule } from './area/area.module';
import { PositionModule } from './position/position.module';
import { AttendanceModule } from './attendance/attendance.module';
import { ShiftModule } from './shift/shift.module';
import { DetailShiftModule } from './detail-shift/detail-shift.module';
import { LoansModule } from './loans/loans.module';
import { PayslipBulananModule } from './payslip-bulanan/payslip-bulanan.module';
import { PayslipProduksiModule } from './payslip-produksi/payslip-produksi.module';
import { PayslipHelperModule } from './payslip-helper/payslip-helper.module';

import dotenv = require('dotenv');
import { TypeOrmModule } from '@nestjs/typeorm';


const { parsed } = dotenv.config({
  path:
    process.cwd() +
    '/.env' +
    (process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''),
});
process.env = { ...process.env, ...parsed };

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: process.env.TYPEORM_HOST,
    password: process.env.TYPEORM_PASSWORD,
    username: process.env.TYPEORM_USERNAME,
    database: process.env.TYPEORM_DATABASE,
    port: Number(process.env.TYPEORM_PORT),
    entities: [
      process.env.TYPEORM_ENTITIES,
      __dirname + '/**/*.entity{.ts,.js}',
      __dirname + '/**/**/*.entity{.ts,.js}',
      __dirname + '/**/**/**/*.entity{.ts,.js}',
    ],
    logging: Boolean(process.env.TYPEORM_LOGGING),
    synchronize: true,
    migrationsRun: false,
    dropSchema: false,
    // cli: {
    //   migrationsDir: __dirname + '/migrations',
    // },
    migrations: [

    ],
  }), EmployeeModule, DepartmentModule, AreaModule, PositionModule, AttendanceModule, ShiftModule, DetailShiftModule, LoansModule, PayslipBulananModule, PayslipProduksiModule, PayslipHelperModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
