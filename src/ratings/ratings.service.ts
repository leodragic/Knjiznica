import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './rating.entity';
import { User } from '../users/user.entity';
import { BooksService } from '../books/books.service';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,
    private booksService: BooksService,
  ) {}

  async rateBook(user: User, bookId: number, ratingValue: number) {
    // 🔐 Varnostna validacija (backend MUST HAVE)
    if (!user) {
      throw new BadRequestException('User not authenticated');
    }

    if (!bookId || isNaN(bookId)) {
      throw new BadRequestException('Invalid book id');
    }

    if (ratingValue < 1 || ratingValue > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    // 📘 Najdi knjigo
    const book = await this.booksService.findOne(bookId);

    // 🚫 Preveri, če je uporabnik že ocenil to knjigo
    const existing = await this.ratingRepository.findOne({
      where: {
        user: { id: user.id },
        book: { id: book.id },
      },
    });

    if (existing) {
      throw new ConflictException('You already rated this book');
    }

    // ⭐ Shrani novo oceno
    const rating = this.ratingRepository.create({
      user,
      book,
      rating: ratingValue,
    });

    await this.ratingRepository.save(rating);

    // 🔄 Posodobi povprečno oceno knjige
    const allRatings = await this.ratingRepository.find({
      where: { book: { id: book.id } },
    });

    const avg =
      allRatings.length === 0
        ? 0
        : allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;

    const roundedAvg = parseFloat(avg.toFixed(2));

    await this.booksService.update(book.id, {
      averageRating: roundedAvg,
    });

    return rating;
  }
}
