import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './schemas/task.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';

@Module({
  imports:[MongooseModule.forFeature([{name:Task.name,schema:TaskSchema},{name:User.name,schema:UserSchema}])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
