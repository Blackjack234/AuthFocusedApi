import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Mongoose, Types } from "mongoose";


export type RefreshTokenDocument = HydratedDocument<RefreshToken>

@Schema({timestamps:true,versionKey:false})

export class RefreshToken {
   @Prop({type:String,required:true,index:true})
   hash:string;
   
   @Prop({type:Types.ObjectId,ref:'User',required:true,index:true})
   userId:string | Types.ObjectId

   // 🔥 NEW FIELD
   @Prop({ type: String, required: true, unique: true, index: true })
   jti: string;


   @Prop({ type: Boolean, default: false })
   isRevoked: boolean;

   @Prop({ type: Date, required: true })
   expiresAt: Date;

   @Prop({ type: String })
   deviceInfo?: string;

   @Prop({ type: String })
   ipAddress?: string;

}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken)