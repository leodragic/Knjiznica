import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { BooksService } from '../books/books.service';
import { Book } from '../books/book.entity';

@Controller('reviews')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly booksService: BooksService,
  ) {}

  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createReview(
    @Request() req,
    @Body() body: { bookId: number; comment: string },
  ) {
    const book: Book = await this.booksService.findOne(body.bookId);
    return this.reviewsService.create(req.user, book, body.comment);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(+id);
  }
}
