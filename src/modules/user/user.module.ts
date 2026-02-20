import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserRepository } from './repositories/user.repository';

@Module({
  imports:[MongooseModule.forFeatureAsync([{
    name:User.name,
    useFactory:()=>{
      const schema = UserSchema
      return schema
    }
  }])],
  controllers: [UserController],
  providers: [UserService,UserRepository],
  exports:[MongooseModule,UserRepository]
})
export class UserModule {}
