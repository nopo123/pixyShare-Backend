import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserController } from './user.controller';
import { AppService } from 'src/app.service';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'dotenv';
config();

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      signOptions: { expiresIn: '2d' },
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [UserController],
  providers: [AppService, UserService],
  exports: [UserService],
})
export class UserModule {}
