import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class CreateUserDto {
  @ApiProperty({example: 'user@mail.com', description: 'Почта'})
  @IsString({message: 'Должно быть строкой'})
  @IsEmail({}, {message: 'Некорректный email'})
  readonly email: string;

  @ApiProperty({example: '12344556', description: 'Пароль'})
  @IsString({message: 'Должно быть строкой'})
  @Length(4, 16, {message: 'Не меньше 4 и не больше 16'})
  readonly password: string

  @ApiProperty({example: 'Борис', description: 'Имя пользователя'})
  @IsString({message: 'Должно быть строкой'})
  @Length(1, 16, {message: 'Не меньше 1 и не больше 16'})
  readonly firstName: string

  @ApiProperty({example: 'Петров', description: 'Имя пользователя'})
  @IsString({message: 'Должно быть строкой'})
  @Length(1, 16, {message: 'Не меньше 1 и не больше 16'})
  readonly secondName: string
}