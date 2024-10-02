import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verifyPassword } from 'src/common/helpers/password.helper';
import { UserEntity } from 'src/user/entities/user.entity';
import { mapUserToGetUserDto } from 'src/user/mappers/user.mapper';
import { UserService } from 'src/user/user.service';
import { GetLoggedInDto } from './dto/get-logged-in.dto';
import { LoginUserDto } from './dto/login.dto';
import { config } from 'dotenv';
config();

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserEntity> {
    const user = await this.usersService.getLoginData(email);

    if (!user) {
      throw new UnauthorizedException(
        'The email or password you entered is incorrect',
      );
    }

    const isPasswordMatching = await verifyPassword(user.password, password);

    if (isPasswordMatching) {
      return await this.usersService.findOneByEmail(email);
    }
    throw new UnauthorizedException('Unauthorized');
  }

  async login(user: LoginUserDto): Promise<GetLoggedInDto> {
    const fetchedUser: UserEntity = await this.validateUser(
      user.email,
      user.password,
    );

    const payload = {
      email: fetchedUser.email,
      role: fetchedUser.role,
    };

    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });

    return {
      access_token: token,
      user: mapUserToGetUserDto(fetchedUser),
    };
  }
}
