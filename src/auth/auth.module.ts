import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JWTStrategy } from './strategy/auth.strategy';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports:[
    PassportModule,
    JwtModule.registerAsync({
      inject:[ConfigService],
      useFactory:(config:ConfigService)=>({
        secret: config.getOrThrow('JWT_SECRET'),
        signOptions:{
          expiresIn: config.getOrThrow('JWT_ACCESS_EXPIRES_IN')
        }
      })
    }),
    UserModule
  ],
  controllers: [AuthController],
  providers: [AuthService,JWTStrategy],
  exports:[PassportModule]
})
export class AuthModule {}
