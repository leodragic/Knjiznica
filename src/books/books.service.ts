import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { Rating } from '../ratings/rating.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,

    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,
  ) {}

  create(data: Partial<Book>) {
    const book = this.bookRepository.create(data);
    return this.bookRepository.save(book);
  }

  findAll() {
    return this.bookRepository.find();
  }

  async findOne(id: number) {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) throw new NotFoundException('Book not found');
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
  async getRecommendedForUser(userId?: number) {
    // Če uporabnik NI prijavljen → top-rated knjige
    if (!userId) {
      return this.bookRepository.find({
        order: { averageRating: 'DESC' },
        take: 5,
        relations: ['category'],
      });
    }

    // Najdi zadnjo VISOKO oceno (4 ali 5)
    const lastHighRating = await this.ratingRepository.findOne({
      where: {
        user: { id: userId },
        rating: 4,
      },
      order: { id: 'DESC' },
      relations: ['book', 'book.category'],
    });

    //  Če ni visoke ocene → top-rated
    if (!lastHighRating) {
      return this.bookRepository.find({
        order: { averageRating: 'DESC' },
        take: 5,
        relations: ['category'],
      });
    }

    const categoryId = lastHighRating.book.category.id;

    // Knjige iz iste kategorije, ki jih user še NI ocenil
    return this.bookRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.category', 'category')
      .leftJoin('book.ratings', 'rating', 'rating.userId = :userId', { userId })
      .where('category.id = :categoryId', { categoryId })
      .andWhere('rating.id IS NULL')
      .take(5)
      .getMany();
  }
}
