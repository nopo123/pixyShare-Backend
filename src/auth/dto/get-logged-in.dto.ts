import { IsObject, IsString, ValidateNested } from 'class-validator';
import { GetUserDto } from '../../user/dto/get-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class GetLoggedInDto {
  @ApiProperty({ example: 'ey...', description: 'Access token' })
  @IsString()
  readonly access_token: string;

  @ApiProperty({ description: 'User' })
  @IsObject({ each: true })
  @ValidateNested()
  @Type(() => GetUserDto)
  readonly user: GetUserDto;
}
