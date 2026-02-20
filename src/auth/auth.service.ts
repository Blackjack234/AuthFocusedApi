import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SaveUserDto } from 'src/modules/user/dtos/user.dto';
import { UserRepository } from 'src/modules/user/repositories/user.repository';
import { User, UserDocument } from 'src/modules/user/schemas/user.schema';

@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService : JwtService,
        private readonly configService : ConfigService,

        private readonly userRepository : UserRepository,
        @InjectModel(User.name) private readonly UserModel : Model<UserDocument>
    ){}

    async login(user:any){
      const payload = {
        sub:user._id,
        email:user.email
      }

      const accessToken = await this.jwtService.signAsync(payload)

      return {
        accessToken
      }
    }


    async generateToken(userId:string,email:string){
        const payload = {
            sub : userId,
            email:email
        }

        const accessToken = await this.jwtService.signAsync(payload,{
            secret:this.configService.get('JWT_ACCESS_SECRET'),
            expiresIn:this.configService.get('JWT_ACCESS_EXPIRES')
        })

        const refreshToken = await this.jwtService.signAsync(payload,{
            secret:this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn:this.configService.get('JWT_REFRESH_EXPIRES')
        })


        return {
            accessToken,
            refreshToken
        }

    }


    async registerUser(payload : SaveUserDto){
       const CheckUser =  await this.userRepository.getByField({
        email:payload.email,
        isDeleted:false
       })


       if(CheckUser){
          throw new BadRequestException('User Already Exists.')
       }

       const savedUser = await this.userRepository.saveUser(payload)

       if(!savedUser._id){
          throw new BadRequestException('something went wrong.')
       }

       const tokens = await this.generateToken(savedUser._id.toString(),savedUser.email)

       const updateToken  = await this.userRepository.updateById({refreshToken:tokens.refreshToken},savedUser._id)

       if(!updateToken){
         throw new Error('update is not done')
       }

       const getUser = await this.userRepository.getById(updateToken._id)

       if(!getUser){
         throw new Error('User not found/user missing.')
       }
         

       return {
        message :'user registration successful.',
        data: {
           userData:getUser,
           accessToken:tokens.accessToken,
           refreshToken:tokens.refreshToken
        }
       }

    }
}
