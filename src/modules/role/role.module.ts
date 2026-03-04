import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './schemas/drole.schema';

@Module({
  imports:[
    MongooseModule.forFeatureAsync([{
      name:Role.name,
      useFactory:()=>{
        const schema = RoleSchema
        return schema
      }  
    }])
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports:[RoleService]
})
export class RoleModule {}
