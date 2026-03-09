import { Injectable } from "@nestjs/common";
import { BaseRepository } from "src/base/base.repository";
import { Role, RoleDocument } from "../schemas/drole.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class RoleRepository extends BaseRepository<RoleDocument>{
  constructor(@InjectModel(Role.name) private readonly roleModel : Model<RoleDocument>){
    super(roleModel)
  }
}