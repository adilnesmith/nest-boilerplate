import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import mongoConfig from '../mongo.config';

@Module({
  imports: [
    MongooseModule.forRoot(mongoConfig.uri, mongoConfig.options),
    UsersModule,
  ],
})
export class AppModule { }
