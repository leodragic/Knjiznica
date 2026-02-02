import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  // =====================
  // PUBLIC ROUTES
  // =====================

  @Get()
  findAll() {
    return this.booksService.findAll();
  }

  // =====================
  // PROTECTED ROUTES
  // =====================
  @UseGuards(JwtAuthGuard)
  @Get('recommended')
  getRecommended(@Req() req) {
    console.log('REQ.USER =', req.user);
    return this.booksService.getRecommendedForUser(req?.user?.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: any) {
    return this.booksService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.booksService.update(Number(id), body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(Number(id));
  }
}
