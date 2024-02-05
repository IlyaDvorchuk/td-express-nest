import {HydratedDocument} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";

export type FeedbackDocument = HydratedDocument<Feedback>

@Schema({ timestamps: true })
export class Feedback {
    @Prop({required: false})
    text: string

    @Prop({required: false})
    rate: number

    @Prop({default: false})
    isRefusal: boolean;

    @Prop({default: []})
    cause: string[]
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
