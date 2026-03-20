import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiconfigModule } from './apiconfig/apiconfig.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { RefreshTokenModule } from './modules/refresh_token/refresh_token.module';
import { RoleModule } from './modules/role/role.module';
import { PaymentModule } from './modules/payment/payment.module';

@Module({
  imports: [ApiconfigModule, AuthModule, UserModule, RefreshTokenModule, RoleModule, PaymentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
