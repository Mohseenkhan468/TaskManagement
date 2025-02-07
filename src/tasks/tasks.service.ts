import { HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
  ) {}
  async createTask(
    user_id: string,
    createTaskDto: CreateTaskDto,
    res: Response,
  ) {
    try {
      const user = await this.userModel.findById(createTaskDto.assigned_to);
      if (!user) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Invalid assigned_to provided.',
        });
      }
      const due_date = new Date(createTaskDto.due_date);
      if (due_date < new Date()) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: 'Past date provided.' });
      }
      const newTask = await new this.taskModel({
        ...createTaskDto,
        assigned_by: new mongoose.Types.ObjectId(user_id),
        due_date,
        assigned_to: new mongoose.Types.ObjectId(createTaskDto.assigned_to),
      }).save();
      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: 'Task created successfully.',
        data: newTask,
      });
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message,
      });
    }
  }
  ////////////////////Get Tasks///////////////////////
  async getTasks(
    user: any,
    title = '',
    description = '',
    status = '',
    priority = '',
    page = 1,
    limit = 10,
    sort_by = 'priority',
    sort_order = '-1',
    res: Response,
  ) {
    try {
      const sortingObj: Record<string, 1 | -1> = {
        [sort_by]: sort_order === '-1' ? -1 : 1,
      };
      const query: any = {
        $or: [
          { title: { $regex: `.*${title}.*`, $options: 'i' } },
          { description: { $regex: `.*${description}.*`, $options: 'i' } },
          { status: { $regex: `.*${status}.*`, $options: 'i' } },
        ].filter(Boolean),
        ...(priority ? { priority: Number(priority) } : {}),
      };
      if (user.role !== 'admin') {
        query.assigned_by = new mongoose.Types.ObjectId(user._id);
      }
      const data = await this.taskModel.aggregate([
        {
          $match: query,
        },
        {
          $project: { password: 0 },
        },
        {
          $sort: sortingObj,
        },
        {
          $skip: Number(page - 1) * limit,
        },
        {
          $limit: Number(limit),
        },
        {
          $lookup: {
            from: 'users',
            as: 'assigned_by',
            let: { user_id: '$assigned_by' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$_id', '$$user_id'],
                  },
                },
              },
              {
                $project: { password: 0 },
              },
            ],
          },
        },
        {
          $unwind: { path: '$assigned_by', preserveNullAndEmptyArrays: true },
        },
        {
          $lookup: {
            from: 'users',
            as: 'assigned_to',
            let: { user_id: '$assigned_to' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$_id', '$$user_id'],
                  },
                },
              },
              {
                $project: { password: 0 },
              },
            ],
          },
        },
        {
          $unwind: { path: '$assigned_to', preserveNullAndEmptyArrays: true },
        },
        {
          $facet: {
            paginatedResults: [
              {
                $sort: { createdAt: -1 },
              },
              { $skip: (page - 1) * limit },
              { $limit: +limit },
            ],
            totalCount: [{ $count: 'count' }],
          },
        },
        {
          $addFields: {
            total: {
              $ifNull: [{ $arrayElemAt: ['$totalCount.count', 0] }, 0],
            },
          },
        },
        {
          $project: {
            paginatedResults: 1,
            total: 1,
          },
        },
      ]);
      if (data[0].total == 0) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'No result found.',
        });
      }
      return res.status(HttpStatus.OK).json({
        success: true,
        current_page: Number(page),
        total_pages: Math.ceil(data[0].total / limit) || 1,
        limit: +limit,
        total: data[0].total,
        data: data[0].paginatedResults,
      });
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message,
      });
    }
  }

  /////////////////////get Task/////////////////
  async getTask(user: any, task_id: string, res: Response) {
    try {
      const userObjId = new mongoose.Types.ObjectId(user._id);
      let query;
      if (user.role !== 'admin') {
        query = {
          $or: [{ assigned_by: userObjId }, { assigned_to: userObjId }],
          _id: new mongoose.Types.ObjectId(task_id),
        };
      } else {
        query = {
          _id: new mongoose.Types.ObjectId(task_id),
        };
      }
      const task = await this.taskModel.findOne(query);
      if (!task) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Task not found.',
        });
      }
      return res.status(HttpStatus.CREATED).json({
        success: true,
        data: task,
      });
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message,
      });
    }
  }
  /////////////////////update Task Dto/////////////////
  async updateTask(
    user: any,
    task_id: string,
    updateTaskDto: UpdateTaskDto,
    res: Response,
  ) {
    try {
      const userObjId = new mongoose.Types.ObjectId(user._id);
      let query;
      if (user.role !== 'admin') {
        query = {
          $or: [{ assigned_by: userObjId }, { assigned_to: userObjId }],
          _id: new mongoose.Types.ObjectId(task_id),
        };
      } else {
        query = {
          _id: new mongoose.Types.ObjectId(task_id),
        };
      }
      const task = await this.taskModel.findOne(query);
      if (!task) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Task not found.',
        });
      }
      await this.taskModel.updateOne({
        ...updateTaskDto,
        due_date: new Date(updateTaskDto.due_date),
        completed_at: updateTaskDto.status == 'completed' ? new Date() : null,
      });
      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: 'Task updated successfully.',
      });
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message,
      });
    }
  }
  ////////////////////////Delete Task///////////////////
  async deleteTask(user: any, task_id: string, res: Response) {
    try {
      const userObjId = new mongoose.Types.ObjectId(user._id);
      let query;
      if (user.role !== 'admin') {
        query = {
          $or: [{ assigned_by: userObjId }, { assigned_to: userObjId }],
          _id: new mongoose.Types.ObjectId(task_id),
        };
      } else {
        query = {
          _id: new mongoose.Types.ObjectId(task_id),
        };
      }
      const task = await this.taskModel.findOne(query);
      if (!task) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Task not found.',
        });
      }
      await this.taskModel.deleteOne({ _id: task._id });
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Task deleted succesfully.',
      });
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message,
      });
    }
  }
}
