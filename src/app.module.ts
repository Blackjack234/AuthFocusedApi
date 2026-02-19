import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiconfigModule } from './apiconfig/apiconfig.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ApiconfigModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
