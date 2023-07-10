import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Comment } from '../../comment/entities/comment.entity';
import { User } from '../../user/entities/user.entity';

export enum PropertyType {
  LAND = 'LAND',
  RESIDENTIAL = 'RESIDENTIAL',
}

@Entity()
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  name: string | null;

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

  @Column({ type: 'text', nullable: true })
  landSize: string | null;

  @Column({ type: 'integer', nullable: true })
  numberOfBathroom: number | null;

  @Column({ type: 'integer', nullable: true })
  numberOfBedroom: number | null;

  @OneToMany(() => Comment, (comment) => comment.propertyId)
  comments: Comment[];

  @ManyToOne(() => User, (user) => user.properties)
  user: User;

  @Column({ type: 'boolean', default: false })
  isSold: boolean;

  @Column({ type: 'boolean', default: true })
  listed: boolean;

  @Column({ type: 'boolean', default: false })
  unlisted: boolean;

  @Column({ type: 'float', nullable: true })
  propertyRating: number | null;

  @Column({ type: 'float', nullable: true })
  valueRating: number | null;

  @Column({ type: 'float', nullable: true })
  locationRating: number | null;

  @Column({ type: 'float', nullable: true })
  supportRating: number | null;

  @Column({ type: 'float', nullable: true })
  totalRating: number | null;

  @Column('simple-array', { nullable: true })
  images: string[] | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  video: string | null;
}
