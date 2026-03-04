import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { statusEnum } from "src/enum/status.enum";


const RoleGroup = ['frontend','backend']

export type RoleDocument = HydratedDocument<Role>
@Schema({timestamps:true,versionKey:false})

export class Role {
    @Prop({type:String,required:true,index:true})
    role:string

    @Prop({type:String,required:true})
    roleDisplayName:string;

    @Prop({type:String,default:'frontend',enum:RoleGroup})
    roleGroup:string;

    @Prop({type:String,default:''})
    description:string;

    @Prop({type:String,default:statusEnum.Active , enum:statusEnum})
    status:string;

    @Prop({type:Boolean,default:false})
    isDeleted:boolean
}

export const RoleSchema = SchemaFactory.createForClass(Role)

