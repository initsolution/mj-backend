import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"

export class LoginUsersDTO{
    @IsNotEmpty()
    @ApiProperty()
    password : string
    
    @IsNotEmpty()
    @ApiProperty()
    email : string
}