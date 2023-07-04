import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';

export enum UserRole {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
}

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({
    default:
      'https://toppng.com/uploads/preview/file-svg-profile-icon-vector-11562942678pprjdh47a8.png',
  })
  profileImg: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  roles: UserRole;

  @Column({ type: 'varchar' })
  location: string;

  @Column({ type: 'int' })
  phone_no: number;

  @Column({ type: 'array' })
  refreshToken: Array<string>;

  @BeforeInsert()
  async hashPassword(password: string): Promise<void> {
    this.password = await bcrypt.hash(password || this.password, 10);
  }
}
