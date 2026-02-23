import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Mongoose, Types } from "mongoose";


export type RefreshTokenDocument = HydratedDocument<RefreshToken>

@Schema({timestamps:true,versionKey:false})

export class RefreshToken {
   @Prop({type:String,required:true,index:true})
   hash:string;
   
   @Prop({type:Types.ObjectId,ref:'User',required:true,index:true})
   userId:string | Types.ObjectId

}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken)