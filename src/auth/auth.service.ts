import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RefreshTokenRepository } from 'src/modules/refresh_token/repositories/refresh_token.repository';
import { SaveUserDto } from 'src/modules/user/dtos/user.dto';
import { UserRepository } from 'src/modules/user/repositories/user.repository';
import { User, UserDocument } from 'src/modules/user/schemas/user.schema';
import { LoginDto } from './dto/login.dto';
import { compare, hash } from 'bcrypt';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService : JwtService,
        private readonly configService : ConfigService,

        private readonly userRepository : UserRepository,

        private readonly refreshTokenRepository: RefreshTokenRepository,
        @InjectModel(User.name) private readonly UserModel : Model<UserDocument>
    ){}

    async login(dto:LoginDto){
      
      const user = await this.userRepository.getByField({email:dto.email})

      if(!user){
         throw new UnauthorizedException('Invalid credential.')
      }

      const passwordhash = await compare(dto.password,user.password)

      if(!passwordhash){
       throw new UnauthorizedException('Invalid password.')
      } 

      // const tokens = await this.generateToken(user._id.toString(),dto.email)


      const tokens = await this.generateToken(
        user._id.toString(),
        user.email,
      );

      // 🔐 Hash refresh token
      const hashedRefreshToken = await hash(
        tokens.refreshToken,
        10,
      );

      // 📅 Calculate expiry date
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      await this.refreshTokenRepository.create({
        hash: hashedRefreshToken,
        userId: user._id,
        jti: tokens.jti,
        expiresAt,
        isRevoked: false,
      });


      return {
        message:"Login successful.",
        data:{
          userData:user,
          accessToken:tokens.accessToken,
          refreshToken:tokens.refreshToken
        }
      }
    }


    async generateToken(userId:string,email:string){
      const jti = randomUUID();

      const payload = {
        sub: userId,
        email,
        jti,
      };

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
            refreshToken,
            jti
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


      //  const updateToken  = await this.userRepository.updateById({refreshToken:tokens.refreshToken},savedUser._id)

      const tokens = await this.generateToken(
        savedUser._id.toString(),
        savedUser.email,
      );

      // 🔐 Hash refresh token
      const hashedRefreshToken = await hash(
        tokens.refreshToken,
        10,
      );

      // 📅 Calculate expiry date
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      await this.refreshTokenRepository.create({
        hash: hashedRefreshToken,
        userId: savedUser._id,
        jti: tokens.jti,
        expiresAt,
        isRevoked: false,
      });




       const getUser = await this.userRepository.getById(savedUser._id)

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


    async refresh(refreshToken:string){
     let payload :any;

     try{
      payload = await this.jwtService.verifyAsync(refreshToken,{
        secret: this.configService.getOrThrow('JWT_REFRESH_SECRET')
      })
     }catch{
       throw new UnauthorizedException('Invalid refresh token.')
     }

     const {
      sub:userId,
      jti,
      email
     } = payload


     const tokenDoc = await this.refreshTokenRepository.findOne({jti})

     if(!tokenDoc){
        throw new UnauthorizedException('Session not found.')
     }

     if(tokenDoc.isRevoked){
      throw new UnauthorizedException('Token Revoked.')
     }

     if(tokenDoc.expiresAt < new Date()){
       throw new UnauthorizedException('Token expired.')
     }
    const isMatch = await compare(refreshToken,tokenDoc.hash)

    if(!isMatch){
      throw new UnauthorizedException('token mismatch.')
    }

    //ROTATION STARTS HERE

    tokenDoc.isRevoked = true
    await tokenDoc.save()

    const newToken = await this.generateToken(userId,email)

    const hashedRefreshToken = await hash(newToken.refreshToken,10)

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.refreshTokenRepository.create({
      userId,
      hash:hashedRefreshToken,
      jti:newToken.jti,
      expiresAt,
      isRevoked:false
    })
      return newToken
    }

  async logout(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token required');
    }

    let payload: any;

    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const { jti } = payload;

    const tokenDoc = await this.refreshTokenRepository.findOne({ jti });

    if (!tokenDoc) {
      throw new UnauthorizedException('Session not found');
    }

    if (tokenDoc.isRevoked) {
      return { message: 'Already logged out' };
    }

    tokenDoc.isRevoked = true;
    await tokenDoc.save();

    return { message: 'Logged out successfully' };
  }
}
