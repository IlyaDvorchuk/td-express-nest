import {Body, Controller, Post} from "@nestjs/common";
import {FeedbackService} from "./feedback.service";
import {FeedbackDto} from "./dto/feedback.dto";

@Controller('feedback')
export class FeedbackController {
    constructor(private readonly feedbackService: FeedbackService) {}

    @Post()
    async createFeedback(
        @Body() feedback: FeedbackDto,
    ) {
        return this.feedbackService.createFeedback(feedback);
    }
}
