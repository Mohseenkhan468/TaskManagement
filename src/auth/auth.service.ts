import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import  { Response } from 'express';
import { Model } from 'mongoose';
import { LoginDto } from 'src/users/dto/user.dto';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}
  async comparePassword(password: string, hashedPassword: string) {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (err) {
      return false;
    }
  }
  async generateToken(payload) {
    try {
      return await this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET_KEY || 'thisissecretkey',
      });
    } catch (err) {
      return '';
    }
  }
  async login(loginDto: LoginDto, res: Response) {
    try {
      const user = await this.userModel.findOne({ email: loginDto.email });
      if (!user) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: 'This email is not registered.',
        });
      }
      const isMatch = await this.comparePassword(
        loginDto.password,
        user.password,
      );
      if (!isMatch) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: 'Invalid credentials.',
        });
      }
      const payload = { _id: user._id, role: user.role };
      const token = await this.generateToken(payload);
      const userObj = user.toJSON();
      delete userObj.password;
      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: 'Login successfully.',
        data: { ...userObj },
        token,
      });
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message,
      });
    }
  }
}
