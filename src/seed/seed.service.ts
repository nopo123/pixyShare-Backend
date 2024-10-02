import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Role } from 'src/role/enums/role';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SeedService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async seed() {
    console.log('Seeding started');

    const createUserDto: CreateUserDto = {
      firstName: 'Pixy',
      lastName: 'Admin',
      email: 'pixyAdmin@email.com',
      password: 'Pass123',
      role: Role.ADMIN,
      nickName: 'PixyAdmin',
    };

    const dbUser: UserEntity = await this.userService.findOneByEmail(
      createUserDto.email,
    );

    if (!dbUser) {
      await this.userService.create(createUserDto);
    }
  }
}
