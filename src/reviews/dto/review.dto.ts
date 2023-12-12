import {ApiProperty} from "@nestjs/swagger";
import {IsNumber, IsString} from "class-validator";

export class ReviewDto {
    @ApiProperty({example: 'Лучший товар', description: 'Текст комментария'})
    @IsString({message: 'Должно быть строкой'})
    readonly text: string;

    @ApiProperty({example: 4.3, description: 'Оценка товара'})
    @IsNumber()
    readonly rate: number;

    @ApiProperty({example: 'Красный', description: 'Название родительского цвета'})
    @IsString({message: 'Должно быть строкой'})
    readonly parentName: string;

    @IsString({message: 'Должно быть строкой'})
    productId: string;

    @ApiProperty({example: 'Вадим Попов', description: 'Имя пользователя'})
    @IsString({message: 'Должно быть строкой'})
    userName: string;
}
