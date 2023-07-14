import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Property } from '../../property/entities/property.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  name: string;

  @ManyToOne(() => Property, (property) => property.comments)
  propertyId: string;

  @Column({ type: 'text' })
  text: string;
}
