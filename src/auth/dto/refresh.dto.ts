import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class RefreshTokenDto{
    @IsString()
    @IsNotEmpty()
    @ApiProperty({description:'refresh token',default:'hsjhdjkasjdhasjdasjdhjasjdjashd'})
    refreshToken:string
}