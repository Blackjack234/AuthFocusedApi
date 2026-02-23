import { Global, Module } from '@nestjs/common';
import { RefreshTokenController } from './refresh_token.controller';
import { RefreshTokenService } from './refresh_token.service';
import { RefreshTokenRepository } from './repositories/refresh_token.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { RefreshToken, RefreshTokenSchema } from './schema/refresh_token.schema';

@Global()
@Module({
  imports:[MongooseModule.forFeatureAsync([{
    name:RefreshToken.name,
    useFactory:()=>{
      const schema  = RefreshTokenSchema
      return schema
    }
  }])],
  controllers: [RefreshTokenController],
  providers: [RefreshTokenService, RefreshTokenRepository],
  exports: [RefreshTokenService, RefreshTokenRepository] 
})
export class RefreshTokenModule  {}
