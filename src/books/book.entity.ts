import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Category } from '../categories/category.entity';
import { Review } from '../reviews/review.entity';
import { Rating } from '../ratings/rating.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 0 })
  averageRating: number;

  @Column({ nullable: true })
  cover_image: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Category, (category) => category.books, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => Review, (review) => review.book)
  reviews: Review[];

  @OneToMany(() => Rating, (rating) => rating.book)
  ratings: Rating[];
}
