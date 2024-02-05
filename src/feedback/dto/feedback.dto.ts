import {IsArray, IsBoolean, IsNumber, IsString, } from "class-validator";

export class FeedbackDto {
    @IsString()
    text?: string

    @IsNumber()
    rate?: number

    @IsArray()
    cause?: string[]

    @IsBoolean()
    isRefusal?: boolean;
}
