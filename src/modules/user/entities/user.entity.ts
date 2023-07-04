import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
}

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
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
}
