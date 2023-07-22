import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Comment } from '../../comment/entities/comment.entity';
import { User } from '../../user/entities/user.entity';
import { Review } from '../../reviews/entities/review.entity';
import { Booking } from '../../bookings/entities/booking.entity';

export enum PropertyType {
  LAND = 'LAND',
  HOUSE = 'HOUSE',
}

export enum PropertyStatus {
  Sold = 'Sold',
  Listed = 'Listed',
  Unlisted = 'Unlisted',
}

@Entity()
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  title: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'text' })
  location: string;

  @Column({
    type: 'enum',
    enum: PropertyType,
  })
  propertyType: PropertyType;

  @Column({ type: 'integer', nullable: true })
  price: number | null;

  @Column({ type: 'varchar', array: true, nullable: true })
  tags: string[];

  @Column({ type: 'varchar', array: true, nullable: true })
  feature: string[];

  @OneToMany(() => Comment, (comment) => comment.propertyId)
  comments: Comment[];

  @OneToMany(() => Review, (review) => review.property)
  reviews: Review[];

  @ManyToOne(() => User, (user) => user.properties)
  admin: User; // renamed admin to lowercase

  @OneToMany(() => Booking, (booking) => booking.property)
  bookings: Booking[];

  @Column({ type: 'varchar', nullable: true })
  salesSuportName: string | null;

  @Column({ type: 'bigint', nullable: true })
  salesSuportNum: number | null;

  @Column({ type: 'varchar', nullable: true })
  salesSupportAvatar: string | null;

  @Column({
    type: 'enum',
    enum: PropertyStatus,
    nullable: true,
  })
  status: PropertyStatus | null;

  @Column('simple-array', { nullable: true })
  images: string[] | null;

  @Column({ type: 'varchar', nullable: true })
  video: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
