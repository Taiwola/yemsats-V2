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
