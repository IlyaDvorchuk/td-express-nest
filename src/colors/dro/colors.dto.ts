import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ColorsDto {
  @ApiProperty({example: 'Красный', description: 'Название цвета'})
  @IsString({message: 'Должно быть строкой'})
  readonly name: string;

  @ApiProperty({example: '#FFF', description: 'Кодировка цвета'})
  @IsString({message: 'Должно быть строкой'})
  readonly color: string
}