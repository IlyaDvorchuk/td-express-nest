import { IsEmail } from "class-validator";

export class ActivateMailDto {
  @IsEmail({}, {message: 'Некорректный email'})
  readonly email: string;
}