import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { PropertyService } from '../property/property.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { RatingDto } from './dto/rating.dto';
import { Request } from 'express';
import { UserService } from '../user/user.service';
import { UserRole } from '../user/entities/user.entity';

@Injectable()
export class ReviewsService {
  constructor(
    private propertyService: PropertyService,
    private userService: UserService,
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
  ) {}

  // private methods
  private async findReviews(id: string) {
    const review = await this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.property', 'property')
      .where('review.id = :id', { id: id }) // Replace "id" with the specific review ID you want to fetch
      .getOne();
    return review;
  }

  private async calculateReviewRatings(
    id: string,
    propertyRating: keyof Review,
  ) {
    const select = propertyRating;
    const reviews = await this.reviewRepository.find({
      where: { property: { id: id } },
      select: [select],
    });

    const totalRating = reviews.length;
    const sumRatings = reviews.reduce(
      (sum, review) => sum + Number(review[select] || 0),
      0,
    );

    if (totalRating === 0) {
      return 0;
    }

    return sumRatings / totalRating;
  }
  // CRUD methods
  async createReview(createReviewDto: CreateReviewDto, id: string) {
    const property = await this.propertyService.findProperty(id);
    if (!property) {
      throw new HttpException(
        'property does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const review = this.reviewRepository.create({
        ...createReviewDto,
        property: property,
      });

      const saveReview = await this.reviewRepository.save(review);
      return saveReview;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    const review = await this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.property', 'property')
      .getMany();
    return review;
  }

  async findOneReview(id: string) {
    const review = await this.findReviews(id);
    return review;
  }

  async findTheLatestReview() {
    const reviews = await this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.property', 'property')
      .orderBy('review.createdAt', 'DESC')
      .getMany();

    return reviews;
  }

  async remove(id: string, req: Request) {
    const review = await this.findOneReview(id);
    const user = req.user;
    if (!review) {
      throw new HttpException('review does not exist', HttpStatus.BAD_REQUEST);
    }

    const findUser = this.userService.getUserById(user.id);

    if (
      user.email !== review.email &&
      (await findUser).roles !== UserRole.ADMIN
    ) {
      throw new HttpException('not authorized', HttpStatus.UNAUTHORIZED);
    }

    const removeReview = await this.reviewRepository.delete(id);

    return removeReview;
  }

  async caculateTotalScore(id: string, rating: RatingDto) {
    try {
      const review = await this.findReviews(id);

      if (!review) {
        throw new HttpException(
          'review does not exist',
          HttpStatus.BAD_REQUEST,
        );
      }

      let ratingProperty = rating.propertyRating;
      let ratingLocation = rating.locationRating;
      let ratingValue = rating.valueRating;
      let ratingSupport = rating.supportRating;

      if (!ratingProperty) {
        ratingProperty = 0;
      }

      if (!ratingLocation) {
        ratingLocation = 0;
      }

      if (!ratingValue) {
        ratingValue = 0;
      }

      if (!ratingSupport) {
        ratingSupport = 0;
      }

      const updateRatings = await this.reviewRepository.update(
        { id: id },
        {
          propertyRating: ratingProperty,
          locationRating: ratingLocation,
          supportRating: ratingSupport,
          valueRating: ratingValue,
        },
      );

      ratingProperty = await this.calculateReviewRatings(
        review.property.id,
        'propertyRating',
      );
      ratingLocation = await this.calculateReviewRatings(
        review.property.id,
        'locationRating',
      );
      ratingValue = await this.calculateReviewRatings(
        review.property.id,
        'valueRating',
      );
      ratingSupport = await this.calculateReviewRatings(
        review.property.id,
        'supportRating',
      );

      const ratingArray = [
        ratingProperty,
        ratingLocation,
        ratingValue,
        ratingSupport,
      ];
      const sum = ratingArray.reduce((acc, rating) => acc + rating, 0);
      let reviewScore = sum / ratingArray.length;

      if (reviewScore > 5.0) {
        reviewScore = 5.0;
      }

      const newScore = await this.reviewRepository.update(
        { id: id },
        { reviewScore: reviewScore },
      );

      if (newScore.affected === 1) {
        const newReview = await this.findReviews(id);
        return newReview;
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
