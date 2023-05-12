import { ApiProperty } from "@nestjs/swagger"

export class CreateUserDto {
    @ApiProperty()
    nama : string
    
    @ApiProperty()
    email ?: string
    
    @ApiProperty()
    password ?: string

   
    @ApiProperty()
    role?: string
}
