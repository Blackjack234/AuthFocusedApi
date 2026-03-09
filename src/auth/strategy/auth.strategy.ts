import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import {ExtractJwt, Strategy} from 'passport-jwt'

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy,'jwt'){
constructor(readonly configService:ConfigService){
   super({
    jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
       secretOrKey: configService.getOrThrow('JWT_SECRET'),
       passReqToCallback:true
   })
}

    async validate(request:Request,payload: any) {

        console.log('JWT payload',payload);
        
        return {
            id:payload.sub,
            email:payload.email,
            role:payload.role
        }; // attaches to req.user
    }
}