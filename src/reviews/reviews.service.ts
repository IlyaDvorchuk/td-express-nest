import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Review, ReviewDocument} from "./reviews.schema";
import {ReviewDto} from "./dto/review.dto";
import {ProductCard} from "../productCard/productCard.schema";

@Injectable()
export class ReviewsService {
    constructor(@InjectModel(Review.name) private reviewRepository: Model<ReviewDocument>,
                @InjectModel(ProductCard.name) private productCardRepository: Model<ProductCard>,) {

    }

    async createReview(userId: string, dto: ReviewDto) {
          const product = await this.productCardRepository.findById(dto.productId);

          if (!product) {
              throw new HttpException(
                  'Product not found',
                  HttpStatus.BAD_REQUEST
              )
          }
        const comment = await this.reviewRepository.create({userId, ...dto});
        product.comments.push(comment);
          await product.save();
          return comment
    }
}
