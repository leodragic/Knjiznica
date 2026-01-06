import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { Rating } from '../ratings/rating.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book, Rating])],
  providers: [BooksService],
  controllers: [BooksController],
})
export class BooksModule {}
