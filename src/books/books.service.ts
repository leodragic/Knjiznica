import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { Rating } from '../ratings/rating.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,

    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
  ) {}

  // =====================
  // CRUD
  // =====================

  create(data: Partial<Book>) {
    const book = this.bookRepository.create(data);
    return this.bookRepository.save(book);
  }

  findAll() {
    return this.bookRepository.find({
      relations: ['category'],
    });
  }

  async findOne(id: number) {
    if (!id || isNaN(Number(id))) {
      throw new NotFoundException('Invalid book id');
    }

    const book = await this.bookRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return book;
  }

  async update(id: number, data: Partial<Book>) {
    const book = await this.findOne(id);
    Object.assign(book, data);
    return this.bookRepository.save(book);
  }

  async remove(id: number) {
    const book = await this.findOne(id);
    return this.bookRepository.remove(book);
  }

  // =====================
  // RECOMMENDATIONS
  // =====================

  async getRecommendedForUser(userId?: number) {
    // Fallback: top-rated knjige
    const getTopRated = () => {
      return this.bookRepository.find({
        order: { averageRating: 'DESC' },
        take: 5,
        relations: ['category'],
      });
    };

    // Če uporabnik ni prijavljen
    if (!userId || isNaN(Number(userId))) {
      return getTopRated();
    }

    // Najdi zadnjo visoko oceno (4 ali 5)
    const lastHighRating = await this.ratingRepository.findOne({
      where: {
        user: { id: userId },
      },
      order: { id: 'DESC' },
      relations: ['book', 'book.category'],
    });

    // Če ni ratinga ali ni kategorije → fallback
    if (
      !lastHighRating ||
      !lastHighRating.book ||
      !lastHighRating.book.category
    ) {
      return getTopRated();
    }

    const categoryId = lastHighRating.book.category.id;

    if (!categoryId || isNaN(Number(categoryId))) {
      return getTopRated();
    }

    // Knjige iz iste kategorije, ki jih uporabnik še NI ocenil
    return this.bookRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.category', 'category')
      .leftJoin('book.ratings', 'rating', 'rating.userId = :userId', { userId })
      .where('category.id = :categoryId', { categoryId })
      .andWhere('rating.id IS NULL')
      .orderBy('book.averageRating', 'DESC')
      .take(5)
      .getMany();
  }
}
