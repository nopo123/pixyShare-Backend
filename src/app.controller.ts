import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './common/decorators/public.decorator';
import { CreateUserDto } from './user/dto/create-user.dto';
import { GetUserDto } from './user/dto/get-user.dto';
import { UserService } from './user/user.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth/auth.service';
import { GetLoggedInDto } from './auth/dto/get-logged-in.dto';
import { LoginUserDto } from './auth/dto/login.dto';
import { UserEntity } from './user/entities/user.entity';
import { LoggedInUser } from './common/decorators/login-user.decorator';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Post('/register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully registered.',
    type: GetUserDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  async register(@Body() createUserDto: CreateUserDto): Promise<GetUserDto> {
    return await this.userService.create(createUserDto);
  }

  @Public()
  @Post('/login')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully logged in.',
    type: String,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async login(@Body() loginUser: LoginUserDto): Promise<GetLoggedInDto> {
    return await this.authService.login(loginUser);
  }

  @Get('/auth/me')
  @HttpCode(HttpStatus.OK)
  async getProfile(
    @LoggedInUser() loggedInUser: UserEntity,
  ): Promise<UserEntity> {
    return await this.userService.findOneByEmail(loggedInUser.email);
  }
}
