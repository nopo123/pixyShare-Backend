import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { Role } from 'src/role/enums/role';

export class GetUserDto {
  @ApiProperty({
    example: 1,
    description: 'User id',
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  readonly id: number;

  @ApiProperty({
    example: 'John',
    description: 'User first name',
    type: String,
  })
  @IsString()
  @MinLength(2, { message: 'First name is too short' })
  @IsNotEmpty()
  readonly firstName: string;

  @ApiProperty({ example: 'Doe', description: 'User last name', type: String })
  @IsString()
  @MinLength(2, { message: 'Last name is too short' })
  @IsNotEmpty()
  readonly lastName: string;

  @ApiProperty({
    example: 'NickName',
    description: 'User nick name',
    type: String,
  })
  @IsString()
  @MinLength(2, { message: 'Nick name is too short' })
  @IsNotEmpty()
  readonly nickName: string;

  @ApiProperty({
    example: 'email@email.com',
    description: 'User email',
    type: String,
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    enum: Role,
    example: Role.ADMIN,
    description: 'User role',
    type: String,
  })
  @IsEnum(Role)
  @IsNotEmpty()
  readonly role: string;
}
