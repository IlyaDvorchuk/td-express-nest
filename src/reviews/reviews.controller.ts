import {Body, Controller, Post, Req, UseGuards} from "@nestjs/common";
import {ReviewsService} from "./reviews.service";
import {ReviewDto} from "./dto/review.dto";
import {JwtAuthGuard} from "../middlewares/auth.middleware";

@Controller('reviews')
export class ReviewsController {

    constructor(private readonly reviewService: ReviewsService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async createOrder(
        @Req() req,
        @Body() order: ReviewDto,
    ) {
        const userId = req.user
        return this.reviewService.createReview(userId, order);
    }
}
