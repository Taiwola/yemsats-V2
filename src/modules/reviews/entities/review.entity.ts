import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Property } from '../../property/entities/property.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'float', nullable: true })
  propertyRating: number | null;

  @Column({ type: 'float', nullable: true })
  valueRating: number | null;

  @Column({ type: 'float', nullable: true })
  locationRating: number | null;

  @Column({ type: 'float', nullable: true })
  supportRating: number | null;

  @Column({ type: 'float', nullable: true })
  reviewScore: number | null;

  @ManyToOne(() => Property, (property) => property.reviews)
  property: Property;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

// Entity reviews

// many to one rel with property

// property (the score; min is 1, max is 5)

//valueForMoney (the score; min is 1, max is 5)

//location (the score; min is 1, max is 5)

// support (the score; min is 1, max is 5)

// name (name of reviewer)

// email

// review (the review itself)

// reviewScore (the average of all above scores)

//timestamps
