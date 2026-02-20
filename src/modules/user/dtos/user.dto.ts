import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SaveUserDto{
    @IsString()
    @IsNotEmpty()
    @ApiProperty({description:'User name',default:'Ayan123'})
    username:string;


    @ApiProperty({description:'Password',default:'123456'})
    @IsString()
    @IsNotEmpty()
    password:string;


    @ApiProperty({description:'email',default:'a@mail.com'})
    @IsEmail()
    @IsNotEmpty()

    email:string;
}