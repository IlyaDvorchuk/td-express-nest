import {Body, Controller, Post} from "@nestjs/common";
import {ReviewsService} from "./reviews.service";
import {ReviewDto} from "./dto/review.dto";

@Controller('reviews')
export class ReviewsController {

    constructor(private readonly reviewService: ReviewsService) {}
    @Post()
    async createOrder(
        @Body() order: ReviewDto,
    ) {
        return this.reviewService.createReview(order);
    }
}
