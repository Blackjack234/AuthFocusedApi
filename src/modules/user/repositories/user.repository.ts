import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../schemas/user.schema";
import { Model, Types } from "mongoose";
import { SaveUserDto } from "../dtos/user.dto";

@Injectable()
export class UserRepository {
    constructor(@InjectModel(User.name) private readonly userModel:Model<User>){
     
    }

    async getByField(params:any) : Promise<UserDocument | null>{
      return await  this.userModel.findOne(params)
    }

    async saveUser(payload:SaveUserDto){
      return await this.userModel.create(payload)
    }

    async getById(id:string | Types.ObjectId){
        return await this.userModel.findById(id)
    }

    async updateById(data:any,id:string | Types.ObjectId){
      return await this.userModel.findByIdAndUpdate(id,data,{new:true})
    }
}