import { Injectable } from "@nestjs/common";
import { BaseRepository } from "src/base/base.repository";
import { RefreshToken, RefreshTokenDocument } from "../schema/refresh_token.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class RefreshTokenRepository extends BaseRepository<RefreshTokenDocument>{
  constructor(@InjectModel(RefreshToken.name) private readonly refreshTokenModel : Model<RefreshTokenDocument> ){
      super(refreshTokenModel)
  }

  
}