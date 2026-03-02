import { Body, Controller, Get, HttpCode, Post, Req, UseGuards, ValidationPipe, Version } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { SaveUserDto } from 'src/modules/user/dtos/user.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh.dto';

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

    @Version('1')
    @Post('refresh')
    @ApiConsumes('application/json')
    @HttpCode(201)

    async refresh(@Body(new ValidationPipe({transform:true})) refreshToken: RefreshTokenDto){
     return await this.authService.refresh(refreshToken.refreshToken)
    }


    @Version('1')
    @Post('logout')
    @ApiConsumes('application/json')
    @HttpCode(201)
    async logout(@Body(new ValidationPipe({transform:true})) refreshToken: RefreshTokenDto) {
      return this.authService.logout(refreshToken.refreshToken);
    }
}
