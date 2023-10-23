import {ApiProperty} from "@nestjs/swagger";

export class AddColorDto {
    @ApiProperty({  description: 'Список цветов с изображениями' })
    colors: string[]
}
