import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [SeedService, UserService],
  exports: [SeedService],
})
export class SeedModule {}
