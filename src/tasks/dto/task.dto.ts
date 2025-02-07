import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDate,
  IsMongoId,
  IsInt,
  Min,
  IsDateString,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: [1, 2, 3, 4] })
  @IsNotEmpty()
  @IsEnum([1, 2, 3, 4])
  priority: 1 | 2 | 3 | 4;

  @ApiProperty({ type: Date })
  @IsNotEmpty()
  @IsDateString()
  due_date: Date;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsMongoId()
  assigned_to: string;
}

export class GetTasksDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
  })
  @IsOptional()
  @IsIn(['pending', 'in_progress', 'completed', 'cancelled'])
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';

  @ApiPropertyOptional({ enum: ['1', '2', '3', '4'] })
  @IsOptional()
  @IsIn(['1', '2', '3', '4'])
  priority?: '1' | '2' | '3' | '4';

  @ApiPropertyOptional({ type: Number, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ type: Number, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({ enum: ['priority', 'due_date'] })
  @IsOptional()
  @IsIn(['priority', 'due_date'])
  sort_by?: string;
  @ApiPropertyOptional({ enum: ['1', '-1'] })
  @IsOptional()
  @IsIn(['1', '-1'])
  sort_order?: string;
}

export class TaskIdParamDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsMongoId()
  task_id: string;
}

export class UpdateTaskDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
  })
  @IsOptional()
  @IsIn(['pending', 'in_progress', 'completed', 'cancelled'])
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';

  @ApiPropertyOptional({ enum: [1, 2, 3, 4] })
  @IsOptional()
  @IsEnum([1, 2, 3, 4])
  priority?: number;

  @ApiPropertyOptional({ type: Date })
  @IsOptional()
  @IsDateString()
  due_date?: Date;
}
