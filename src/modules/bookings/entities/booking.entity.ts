import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Property } from '../../property/entities/property.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('boolean')
  booking: boolean;

  @ManyToOne(() => User, (user) => user.bookings)
  user: User;

  @ManyToOne(() => Property, (property) => property.bookings)
  property: Property;

  @CreateDateColumn({ type: 'timestamp' })
  booking_date: Date;
}
