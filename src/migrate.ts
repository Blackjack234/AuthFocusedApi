import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import mongoose, { Model } from "mongoose";
import { Role } from "./modules/role/schemas/drole.schema";
import { User } from "./modules/user/schemas/user.schema";

import * as RoleData from "./assets/role.json";
import * as UserData from "./assets/user.json";

async function migrate(){
    const app = await NestFactory.createApplicationContext(AppModule)

    // model injection

    const roleModel = app.get<Model<Role>>('RoleModel')
    const userModel = app.get<Model<User>>('UserModel')


    // sync the index

    roleModel.syncIndexes()
    userModel.syncIndexes()

    console.log('Index sync completed');


    const existsRole = await roleModel.countDocuments()
    
    if(existsRole === 0 ){
        console.log(RoleData,"RoleData");
        console.log(require('./assets/role.json'));
        
        
      await roleModel.insertMany(RoleData)
      console.log('Roles are inserted.');
    }


    //find the admin role

    const adminRole = await roleModel.findOne({role:'admin'})
    const existingUser = await userModel.findOne({email:UserData.email})

    if(!existingUser){
     await userModel.create({...UserData,role:adminRole?._id})

     console.log('Default admin user created.');
     
    }

    console.log('Migration completed successfully.');

    await app.close()
    await mongoose.disconnect();
    process.exit(0)

}

migrate().catch(async (err:any)=>{
  console.error('Migrate failed.', err)
  await mongoose.disconnect()
  process.exit(1)
})