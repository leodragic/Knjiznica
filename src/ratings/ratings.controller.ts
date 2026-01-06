import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  rateBook(@Request() req, @Body() body: { bookId: number; rating: number }) {
    return this.ratingsService.rateBook(req.user, body.bookId, body.rating);
  }
}
