import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import { Role } from 'src/role/enums/role';
import { passwordHash } from 'src/common/helpers/password.helper';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'firstName', length: 50, nullable: true })
  firstName: string;

  @Column({ name: 'lastName', length: 50, nullable: true })
  lastName: string;

  @Column({ name: 'nickName', length: 50, nullable: true })
  nickName: string;

  @Column({ name: 'email', unique: true, nullable: false })
  email: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ name: 'role', nullable: false })
  role: string;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) this.password = await passwordHash(this.password);
  }
}
