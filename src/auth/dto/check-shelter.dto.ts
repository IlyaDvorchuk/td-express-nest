import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber, IsString } from "class-validator";

export class CheckShelterDto {
  @ApiProperty({example: 'user@mail.com', description: 'Почта'})
  @IsString({message: 'Должно быть строкой'})
  @IsEmail({}, {message: 'Некорректный email'})
  readonly email: string;

  @ApiProperty({example: '77895456', description: 'Номер телефона'})
  @IsString({message: 'Должно быть строкой'})
  readonly phone: string
}