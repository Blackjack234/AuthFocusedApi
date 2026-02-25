import { Body, Controller, Get, HttpCode, Post, Req, UseGuards, ValidationPipe, Version } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { SaveUserDto } from 'src/modules/user/dtos/user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService:AuthService){}


    

    @Post('login')
    async login(@Body(new ValidationPipe({ transform: true })) body: LoginDto){

        // console.log(body);
    

       return await this.authService.login(body)
    }

    @Get('profile')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    async getProfile(@Req() req){
     return {
        message:'protected route',
        user:req.user
     }
    }


    @Version('1')
    @Post('register')
    @ApiConsumes('application/json')
    @HttpCode(201)
    async RegisterUser(@Body(new ValidationPipe({transform:true})) body:SaveUserDto){
      return await this.authService.registerUser(body)
    }
}
