import { GetUserDto } from '../dto/get-user.dto';
import { UserEntity } from '../entities/user.entity';

export const mapUserToGetUserDto = (user: UserEntity): GetUserDto => {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    nickName: user.nickName,
    email: user.email,
    role: user.role,
  };
};
