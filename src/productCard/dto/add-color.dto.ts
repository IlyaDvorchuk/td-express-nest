import {ApiProperty} from "@nestjs/swagger";
import {IsString} from "class-validator";

export class AddColorDto {
    @ApiProperty({ example: 'XXL', description: 'Размер' })
    @IsString()
    readonly name: string;

    @ApiProperty({ example: 'XXL', description: 'Размер' })
    @IsString()
    readonly color: string;

    @ApiProperty({ example: 'Беспорядочный набор символов', description: 'Фотография' })
    @IsString()
    image: string
}
