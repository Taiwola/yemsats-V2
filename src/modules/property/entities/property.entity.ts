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
  Tags: string[];

  @Column({ type: 'varchar', array: true, nullable: true })
  Feature: string[];
  /**
 * Tags are supposed to be dynamic and not fixed so intead of this have a features array where the admin
 * can speciy landSize instead

  @Column({ type: 'integer', nullable: true })
  numberOfBathroom: number | null;

  @Column({ type: 'integer', nullable: true })
  numberOfBedroom: number | null;
*/
  @OneToMany(() => Comment, (comment) => comment.propertyId)
  comments: Comment[];

  @OneToMany(() => Review, (review) => review.property)
  reviews: Review[];

  @ManyToOne(() => User, (user) => user.properties)
  ADMIN: User; // rename user to admin here so it will be ref as adminId in the db

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

// manytoone rel with admin

// title

// description

// location

// price

// property type (should be house and land)

// upload images and video to cloudinary and save their url

// tags array of strings

// features: array of strings

//property status (listed, unlisted, deleted and sold. unlisted should be the default status)

// one to many rel with reviews

//salesSuportName

//salesSuportNum

//salesSupportAvatar

// timestamps
