import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

@Schema()
export class Task {
  @Prop({ required: true, ref: User.name })
  assigned_by: mongoose.Types.ObjectId;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ trim: true })
  description: string;

  @Prop({
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
    default: 'pending',
  })
  status: string;

  @Prop({ enum: [1, 2, 3, 4], default: 1, required: true })
  priority: number; ///////1-> Low, 2-> Medium , 3-> High ,4->Urgent

  @Prop({ required: true })
  due_date: Date;

  @Prop({ required: true, ref: User.name })
  assigned_to: mongoose.Types.ObjectId;

  @Prop({ default: null })
  completed_at: Date;
}
export const TaskSchema = SchemaFactory.createForClass(Task);
export type TaskDocument = Task & Document;
