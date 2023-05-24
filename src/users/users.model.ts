import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsNotEmpty, IsEmail } from 'class-validator';

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({ required: true })
    @IsNotEmpty()
    fullName: string;

    @Prop({ required: true, unique: true })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @Prop()
    age: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
