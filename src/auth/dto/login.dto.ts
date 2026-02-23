import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto{
    @ApiProperty({description:'user email',default:"something@yopmail.com"})
    @IsEmail()
    @IsNotEmpty()
    email:string;
    
    @ApiProperty({description:'password',default:"123456"})
    @IsString()
    @Transform(({value}:TransformFnParams) => value?.trim())

    password:string
}