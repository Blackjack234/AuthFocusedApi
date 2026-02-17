import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiconfigModule } from './apiconfig/apiconfig.module';

@Module({
  imports: [ApiconfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
