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
    // 🔁 Fallback: top-rated knjige
    const getTopRated = async () => {
      return this.bookRepository.find({
        order: { averageRating: 'DESC' },
        take: 5,
        relations: ['category'],
      });
    };

    // 👤 Če uporabnik ni prijavljen
    if (!userId || isNaN(Number(userId))) {
      return getTopRated();
    }

    // ⭐ Najdi ZADNJO VISOKO oceno (4 ali 5)
    const lastHighRating = await this.ratingRepository.findOne({
      where: [
        { user: { id: userId }, rating: 5 },
        { user: { id: userId }, rating: 4 },
      ],
      order: { id: 'DESC' },
      relations: ['book', 'book.category'],
    });

    // Če ni visoke ocene → fallback
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

    // 📚 Knjige iz iste kategorije (lahko tudi že ocenjene)
    const sameCategoryBooks = await this.bookRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.category', 'category')
      .where('category.id = :categoryId', { categoryId })
      .orderBy('book.averageRating', 'DESC')
      .take(5)
      .getMany();

    // Če ni rezultatov → fallback
    if (sameCategoryBooks.length === 0) {
      return getTopRated();
    }

    return sameCategoryBooks;
  }
}
