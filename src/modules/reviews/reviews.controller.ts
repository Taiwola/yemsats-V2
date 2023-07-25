import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { RatingDto } from './dto/rating.dto';
import { Roles } from '../auth/decorators/user.roles';
import { RolesGaurd } from '../auth/gaurds/roles.gaurd';
import { UserRole } from '../user/entities/user.entity';
import { Request } from 'express';
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post(':id')
  create(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewsService.createReview(createReviewDto, id);
  }

  @Get('all')
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.reviewsService.findOneReview(id);
  }

  @Patch('rating/:id')
  async addRating(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() rating: RatingDto,
  ) {
    return await this.reviewsService.caculateTotalScore(id, rating);
  }

  @Get()
  async getLatest() {
    return await this.reviewsService.findTheLatestReview();
  }

  @Roles(UserRole.ADMIN, UserRole.ADMIN)
  @UseGuards(RolesGaurd)
  @Delete('delete/:id')
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    return this.reviewsService.remove(id, req);
  }
}
