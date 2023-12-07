import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {ReviewsController} from "./reviews.controller";
import {ReviewsService} from "./reviews.service";
import {Review, ReviewSchema} from "./reviews.schema";
import {ProductCard, ProductCardSchema} from "../productCard/productCard.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Review.name, schema: ReviewSchema },
            { name: ProductCard.name, schema: ProductCardSchema },
        ]),
    ],
    controllers: [ReviewsController],
    providers: [ReviewsService],
})
export class ReviewsModule {}
