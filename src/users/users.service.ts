import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateNewUserDto, CreateUserDto, EditUserDto } from './dto/user.dto';
import { Response } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async hashPassword(password) {
    try {
      return await bcrypt.hash(password, 10);
    } catch (err) {
      return '';
    }
  }
  async signup(createUserDto: CreateUserDto, res: Response) {
    try {
      /////////////////////////Find User///////////////////////
      const user = await this.userModel.findOne({
        email: createUserDto.email,
      });
      /////////////////////If email exists///////////////////////
      if (user) {
        ////////////////////If user is not verified///////////
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'This email is already registered.',
        });
      }
      /////////////////////////If email not exists then create new user/////////////////
      await new this.userModel({
        ...createUserDto,
        password: await this.hashPassword(createUserDto.password),
        role: createUserDto.role,
      }).save();
      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: 'User created successfully.',
        action: 'login',
      });
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message,
      });
    }
  }
  ////////////////////////Get All Users////////////////////////
  async getAllUsers(page = 1, limit = 10, search = '', res: Response) {
    try {
      const data = await this.userModel
        .find({
          email: { $regex: `.*${search}.*`, $options: 'i' },
        })
        .select({ password: 0 })
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));
      const total = await this.userModel.countDocuments({
        email: { $regex: `.*${search}.*`, $options: 'i' },
      });
      return res.status(HttpStatus.OK).json({
        success: true,
        current_page: Number(page),
        total_pages: Math.ceil(Number(total) / Number(limit)) || 0,
        limit: Number(limit),
        total: Number(total),
        data,
      });
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message,
      });
    }
  }
  ////////////////////////Create New User/////////////////////////
  async createUser(createUserDto: CreateNewUserDto, res: Response) {
    try {
      const user = await this.userModel.findOne({ email: createUserDto.email });
      if (user) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'This email is already registered.',
        });
      }
      await new this.userModel({
        ...createUserDto,
        password: await this.hashPassword(createUserDto.password),
        role: 'user',
      }).save();
      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: 'User created successfully.',
      });
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message,
      });
    }
  }
  ////////////////////////Get User/////////////////////////
  async getUser(user_id: string, res: Response) {
    try {
      const user = await this.userModel.findById(user_id);
      if (!user) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'User not exists.',
        });
      }
      const userObj = user.toJSON();
      delete userObj.password;
      return res.status(HttpStatus.CREATED).json({
        success: true,
        data: userObj,
      });
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message,
      });
    }
  }
  //////////////////////////Edit User//////////////////////////////
  async editUser(user_id: string, editUserDto: EditUserDto, res: Response) {
    try {
      const user = await this.userModel.findById(user_id);
      if (!user) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'User not exists.',
        });
      }
      if (user.role == 'admin') {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Provided user is admin user.',
        });
      }
      await this.userModel.updateOne(
        { _id: user._id },
        { $set: { ...editUserDto } },
      );
      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: 'User edited successfully.',
      });
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message,
      });
    }
  }
  ///////////////////////Delete User///////////////////////////////////
  async deleteUser(user_id: string, res: Response) {
    try {
      const user = await this.userModel.findById(user_id);
      if (!user) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'User not exists.',
        });
      }
      if (user.role == 'admin') {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Provided user is admin user.',
        });
      }
      await this.userModel.deleteOne({ _id: user._id });
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'User deleted successfully.',
      });
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message,
      });
    }
  }
}
