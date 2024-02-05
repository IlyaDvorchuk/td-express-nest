import {Injectable,} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Feedback, FeedbackDocument} from "./feedback.schema";
import {FeedbackDto} from "./dto/feedback.dto";

@Injectable()
export class FeedbackService {
    constructor(
        @InjectModel(Feedback.name) private readonly feedbackModel: Model<FeedbackDocument>,
    ) {}

    async createFeedback(feedbackDto: FeedbackDto) {
        return await this.feedbackModel.create(feedbackDto)
    }
}
