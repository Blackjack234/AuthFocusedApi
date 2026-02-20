import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { genSalt, hash, hashSync } from 'bcrypt'

export type UserDocument = HydratedDocument<User>

@Schema({ timestamps: true, versionKey: false })

export class User {
    @Prop({ type: String, default: '' })
    username: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ type: Boolean, default: false })
    isDeleted: boolean;

    @Prop({ type: String, default: null })
    refreshToken?: string | null;
}

export const UserSchema = SchemaFactory.createForClass(User)


UserSchema.pre('save', async function (next: any) {
    let user = this as UserDocument

    if (!user.isModified('password')) return next()

    const salt = await genSalt(10)
    const hash = hashSync(this.password, salt)
    user.password = hash
    next()

})