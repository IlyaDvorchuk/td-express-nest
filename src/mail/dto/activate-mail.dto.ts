import {IsBoolean, IsEmail} from "class-validator";

export class ActivateMailDto {
  @IsEmail({}, {message: 'Некорректный email'})
  readonly email: string;

  @IsBoolean( )
  readonly isShelter?: boolean;

  @IsBoolean( )
  isNotExamination?: boolean
}