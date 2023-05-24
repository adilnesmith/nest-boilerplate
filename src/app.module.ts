import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './users/users.module';
import mongoConfig from '../mongo.config';

@Module({
  imports: [
    MongooseModule.forRoot(mongoConfig.uri, mongoConfig.options),
    UserModule,
  ],
})
export class AppModule { }
