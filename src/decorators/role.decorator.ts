import { CustomDecorator, SetMetadata } from "@nestjs/common";
import { UserRoleEnum } from "src/enum/user-role.enum";

export const Roles = (...roles : UserRoleEnum[]):CustomDecorator<string> => {
   return SetMetadata('role',roles)
}