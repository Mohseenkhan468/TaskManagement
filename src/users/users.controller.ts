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
import { UsersService } from './users.service';
import { CreateNewUserDto, CreateUserDto, EditUserDto } from './dto/user.dto';
import { Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { AdminAuthGuard } from 'src/auth/auth.admin.guard';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  @ApiOperation({ summary: 'User signup' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async signup(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    return await this.usersService.signup(createUserDto, res);
  }

  @Get('list')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all users' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Limit number of users' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search users' })
  @ApiResponse({ status: 200, description: 'List of users' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAllUsers(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
    @Res() res: Response,
  ) {
    return await this.usersService.getAllUsers(page, limit, search, res);
  }

  @UseGuards(AdminAuthGuard)
  @Post('create_user')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createUser(
    @Body() createNewUserDto: CreateNewUserDto,
    @Res() res: Response,
  ) {
    return await this.usersService.createUser(createNewUserDto, res);
  }

  @Get('get_user/:user_id')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'user_id', type: String, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUser(
    @Param('user_id') user_id: string,
    @Res() res: Response,
  ) {
    return await this.usersService.getUser(user_id, res);
  }

  @Put('edit_user/:user_id')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Edit user by ID' })
  @ApiParam({ name: 'user_id', type: String, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async editUser(
    @Param('user_id') user_id: string,
    @Body() editUserDto: EditUserDto,
    @Res() res: Response,
  ) {
    return await this.usersService.editUser(user_id, editUserDto, res);
  }

  @Delete('delete_user/:user_id')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiParam({ name: 'user_id', type: String, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteUser(
    @Param('user_id') user_id: string,
    @Res() res: Response,
  ) {
    return await this.usersService.deleteUser(user_id, res);
  }
}
