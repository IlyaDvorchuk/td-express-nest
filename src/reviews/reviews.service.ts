import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Review, ReviewDocument} from "../productCard/reviews.schema";
import {ReviewDto} from "./dto/review.dto";

@Injectable()
export class ReviewsService {
    constructor(@InjectModel(Review.name) private reviewRepository: Model<ReviewDocument>,) {
    }

    async createReview(dto: ReviewDto) {
        return await this.reviewRepository.create(dto);
    }
}
