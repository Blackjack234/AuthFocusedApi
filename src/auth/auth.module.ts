import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JWTStrategy } from './strategy/auth.strategy';
import { UserModule } from 'src/modules/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RefreshToken, RefreshTokenSchema } from 'src/modules/refresh_token/schema/refresh_token.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      {name:RefreshToken.name,schema : RefreshTokenSchema}
    ]),
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
