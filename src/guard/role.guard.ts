import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { UserRoleEnum } from "src/enum/user-role.enum";

@Injectable()

export class RBAcGuard implements CanActivate{
    constructor(private reflector : Reflector){}

    async canActivate(context: ExecutionContext): Promise<boolean>  {
        const roles = this.reflector.get<UserRoleEnum[]>('roles',context.getHandler())

        if(!roles) return true

        const request = context.switchToHttp().getRequest()

        const user  = request.user

        return roles.includes(user.role)
    }
}