import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber, IsString } from "class-validator";

export class GenerateTokensDto {
  @ApiProperty({example: 'user@mail.com', description: 'Почта'})
  @IsString({message: 'Должно быть строкой'})
  @IsEmail({}, {message: 'Некорректный email'})
  readonly email: string;

  @IsNumber({}, {message: 'Должно быть числом'})
  readonly userId: any
}