import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Property } from '../../property/entities/property.entity';

export enum UserRole {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
}

@Entity()
export class User {
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

  @Column({ type: 'bigint' })
  phone_no: number;

  @Column({ type: 'varchar', array: true, nullable: true })
  refreshToken: string[];

  @OneToMany(() => Property, (property) => property.user)
  properties: Property[];
}
