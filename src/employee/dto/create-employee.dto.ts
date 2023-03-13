import { IsString } from "class-validator"
import { ApiProperty } from '@nestjs/swagger';
import { Department } from "src/department/entities/department.entity";
import { Shift } from "src/shift/entities/shift.entity";
import { Area } from "src/area/entities/area.entity";
import { Position } from "src/position/entities/position.entity";
export class CreateEmployeeDto {
    @ApiProperty()
    id? : string
    
    @ApiProperty()
    name ?: string
    
    @ApiProperty()
    phone_no ?: string
    
    @ApiProperty()
    address ?: string
    
    @ApiProperty()
    type ?: string
    
    @ApiProperty({
        description : '1 = true, 0 = false. default 1',
        default : 1
    })
    active ?: number // 1-> true, 0 -> false
    
    @ApiProperty()
    active_date ?: string
    
    @ApiProperty()
    bpjs_id ?: string
    
    @ApiProperty()
    npwp_id ?: string

    @ApiProperty()
    date_of_birth ?: string
    
    @ApiProperty()
    extra_full ?: number
    
    @ApiProperty()
    iuran_bpjs_tk ?: number
    
    @ApiProperty()
    iuran_bjs_ks ?: number
    
    @ApiProperty()
    iuran_spsi ?: number
    
    @ApiProperty()
    insentif_extra ?: number
    
    @ApiProperty()
    extra_tambahan_kerja ?: number
    
    @ApiProperty()
    gaji_pokok ?: number
    
    @ApiProperty()
    tunjangan_kehadiran ?: number
    
    @ApiProperty()
    owner_rate ?: number
    
    @ApiProperty()
    owner_bonus_khusus ?: number
    
    @ApiProperty()
    owner_overtime_rate ?: number
    
    @ApiProperty()
    meta ?:any
    
    @ApiProperty()
    department ?:Department
    
    @ApiProperty()
    area ?:Area
    
    @ApiProperty()
    position ?:Position
    
    @ApiProperty()
    shift ?:Shift
}

export class BulkCreateEmployeeDto {
    
    @ApiProperty()
    bulk : CreateEmployeeDto[]
}