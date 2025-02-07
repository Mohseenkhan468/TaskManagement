import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, GetTasksDto, UpdateTaskDto } from './dto/task.dto';
import { Response } from 'express';
import { UserDecorator } from 'src/users/decorators/user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('create_task')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  async createTask(
    @UserDecorator() user: object,
    @Body() createTaskDto: CreateTaskDto,
    @Res() res: Response,
  ) {
    return await this.tasksService.createTask(user['_id'], createTaskDto, res);
  }

  @Get('list')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiQuery({
    name: 'title',
    required: false,
    type: String,
    description: 'Task title',
  })
  @ApiQuery({
    name: 'description',
    required: false,
    type: String,
    description: 'Task description',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    description: 'Task status',
  })
  @ApiQuery({
    name: 'priority',
    required: false,
    type: String,
    enum: ['1', '2', '3', '4'],
    description: 'Task priority',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of tasks per page',
  })
  @ApiQuery({
    name: 'sort_by',
    required: false,
    type: String,
    enum: ['priority', 'due_date'],
    description: 'Sorting of tasks',
  })
  @ApiQuery({
    name: 'sort_order',
    required: false,
    type: String,
    enum: ['1', '-1'],
    description: '1 for ascending, -1 for descending',
  })
  @ApiResponse({ status: 200, description: 'List of tasks' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  async getTasks(
    @UserDecorator() user: object,
    @Query() query: GetTasksDto,
    @Res() res: Response,
  ) {
    return await this.tasksService.getTasks(
      user,
      query.title,
      query.description,
      query.status,
      query.priority,
      query.page,
      query.limit,
      query.sort_by,
      query.sort_order,
      res,
    );
  }

  @Get('get_task/:task_id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get a specific task by ID' })
  @ApiParam({ name: 'task_id', type: String, description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'Task found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  async getTask(
    @UserDecorator() user: object,
    @Param('task_id') task_id: string,
    @Res() res: Response,
  ) {
    return await this.tasksService.getTask(user, task_id, res);
  }

  @Put('update_task/:task_id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a task by ID' })
  @ApiParam({ name: 'task_id', type: String, description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  async updateTask(
    @UserDecorator() user: object,
    @Param('task_id') task_id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Res() res: Response,
  ) {
    return await this.tasksService.updateTask(
      user,
      task_id,
      updateTaskDto,
      res,
    );
  }

  @Delete('delete_task/:task_id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a task by ID' })
  @ApiParam({ name: 'task_id', type: String, description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  async deleteTask(
    @UserDecorator() user: object,
    @Param('task_id') task_id: string,
    @Res() res: Response,
  ) {
    return await this.tasksService.deleteTask(user, task_id, res);
  }
}
