import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  first_name: string;
  @Prop({ default: '', trim: true })
  last_name: string;
  @Prop({ required: true, trim: true, lowercase: true })
  email: string;
  @Prop({ required: true, trim: true })
  password: string;
  @Prop({ required: true, trim: true, enum: ['user', 'admin'] })
  role: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document;
