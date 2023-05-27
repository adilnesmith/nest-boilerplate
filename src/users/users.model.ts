import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { IsNotEmpty, IsEmail, IsOptional } from 'class-validator';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {

    @Prop({ required: true })
    @IsNotEmpty()
    @IsOptional()
    fullName: string;

    @Prop({ required: true, unique: true })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @Prop({ required: true })
    @IsNotEmpty()
    password: string;

    @Prop()
    age: number;

    createdAt: Date;

    modifiedAt: Date;

    // async comparePassword(enteredPassword: string): Promise<boolean> {
    //     return bcrypt.compare(enteredPassword, this.password);
    // }
}

export const UserSchema = SchemaFactory.createForClass(User);
