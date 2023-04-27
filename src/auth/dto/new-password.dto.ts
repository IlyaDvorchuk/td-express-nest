import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class NewPasswordDto {
  @ApiProperty({example: 'user@mail.com', description: 'Почта'})
  @IsString({message: 'Должно быть строкой'})
  @IsEmail({}, {message: 'Некорректный email'})
  readonly email: string;

  @ApiProperty({example: 'dfsakjdo3', description: 'Пароль'})
  @IsString({message: 'Должно быть строкой'})
  readonly password: string
}
