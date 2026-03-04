import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Mongoose, Types } from "mongoose";
import { genSalt, hash, hashSync } from 'bcrypt'
import { statusEnum } from "src/enum/status.enum";

export type UserDocument = HydratedDocument<User>

@Schema({ timestamps: true, versionKey: false })

export class User {
    @Prop({ type: String, default: '' })
    username: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({type:Types.ObjectId,ref:'Role',index:true,})
    role:Types.ObjectId | string

    @Prop({ type: Boolean, default: false })
    isDeleted: boolean;

    @Prop({type:String,default:'Active',enum:statusEnum})
    status:String;

    @Prop({ type: String, default: null })
    refreshToken?: string | null;
}

export const UserSchema = SchemaFactory.createForClass(User)


UserSchema.pre('save', async function () {
    let user = this as UserDocument

    if (!user.isModified('password')) return ;

    const salt = await genSalt(10)
    const hash = hashSync(this.password, salt)
    user.password = hash
    // next()

})