import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from 'src/role/enums/role';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { mapUserToGetUserDto } from './mappers/user.mapper';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<GetUserDto> {
    if (createUserDto.role !== Role.ADMIN && createUserDto.role !== Role.USER) {
      throw new NotFoundException('Role not found');
    }

    const user = this.userRepository.create(createUserDto);
    const savedUser = await this.userRepository.save(user);

    return mapUserToGetUserDto(savedUser);
  }

  async findAll(): Promise<GetUserDto[]> {
    const users = await this.userRepository.find();

    return users.map((user) => {
      return mapUserToGetUserDto(user);
    });
  }

  async findOne(id: number): Promise<GetUserDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return mapUserToGetUserDto(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<GetUserDto> {
    const user = await this.findOne(id);

    const savedUser = await this.userRepository.save({
      ...user,
      ...updateUserDto,
    });

    return mapUserToGetUserDto(savedUser);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);

    await this.userRepository.delete(id);
  }

  async findOneByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: {
        email: email,
      },
      select: ['id', 'email', 'role', 'firstName', 'lastName', 'nickName'],
    });
  }

  async getLoginData(email: string): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: {
        email: email,
      },
      select: ['id', 'email', 'password'],
    });
  }
}
