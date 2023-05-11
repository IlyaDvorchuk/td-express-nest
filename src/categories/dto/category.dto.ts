import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUrl } from "class-validator";

export class CategoryDto {
  @ApiProperty({example: 'Электроника', description: 'Категория'})
  @IsString({message: 'Должно быть строкой'})
  readonly name: string;

  @IsUrl()
  readonly urlImage: string
}