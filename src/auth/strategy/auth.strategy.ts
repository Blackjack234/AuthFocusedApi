import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
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

    async validate(payload: any) {
        return payload; // attaches to req.user
    }
}