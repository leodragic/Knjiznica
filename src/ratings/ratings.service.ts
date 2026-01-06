import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './rating.entity';
import { User } from '../users/user.entity';
//import { Book } from '../books/book.entity';
import { BooksService } from '../books/books.service';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,
    private booksService: BooksService,
  ) {}

  async rateBook(user: User, bookId: number, ratingValue: number) {
    const book = await this.booksService.findOne(bookId);

    const existing = await this.ratingRepository.findOne({
      where: { user: { id: user.id }, book: { id: book.id } },
    });

    if (existing) throw new ConflictException('You already rated this book');

    const rating = this.ratingRepository.create({
      user,
      book,
      rating: ratingValue,
    });
    await this.ratingRepository.save(rating);

    // Update average rating
    const allRatings = await this.ratingRepository.find({
      where: { book: { id: book.id } },
    });
    const avg =
      allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;
    book.averageRating = parseFloat(avg.toFixed(2));
    await this.booksService.update(book.id, {
      averageRating: book.averageRating,
    });

    return rating;
  }
}
