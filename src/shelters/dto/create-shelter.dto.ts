import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsString, Length, ValidateNested } from "class-validator";

export class ClosePerson {
  @ApiProperty({example: 'Борис', description: 'Имя близкого человека'})
  @IsString({message: 'Должно быть строкой'})
  @Length(1, 16, {message: 'Не меньше 1 и не больше 16'})
  readonly name: string

  @ApiProperty({example: 'Иванов', description: 'Фамилия близкого человека'})
  @IsString({message: 'Должно быть строкой'})
  @Length(1, 16, {message: 'Не меньше 1 и не больше 16'})
  readonly family: string

  @ApiProperty({example: 'Петрович', description: 'Отчество близкого человека'})
  @IsString({message: 'Должно быть строкой'})
  @Length(1, 16, {message: 'Не меньше 1 и не больше 16'})
  readonly patronymic: string

  @ApiProperty({example: '77546548', description: 'Номер близкого человека'})
  @IsString({message: 'Должно быть строкой'})
  @Length(7, 16, {message: 'Не меньше 7 и не больше 16'})
  readonly phone: string
}

export class PersonalData {
  @ApiProperty({example: 'Борис', description: 'Имя продавца'})
  @IsString({message: 'Должно быть строкой'})
  @Length(1, 16, {message: 'Не меньше 1 и не больше 16'})
  readonly name: string

  @ApiProperty({example: 'Иванов', description: 'Фамилия продавца'})
  @IsString({message: 'Должно быть строкой'})
  @Length(1, 16, {message: 'Не меньше 1 и не больше 16'})
  readonly family: string

  @ApiProperty({example: 'Петрович', description: 'Отчество продавца'})
  @IsString({message: 'Должно быть строкой'})
  @Length(1, 16, {message: 'Не меньше 1 и не больше 16'})
  readonly patronymic: string

  @ApiProperty({example: '25.03.2001', description: 'Дата рождения продавца'})
  @IsString({message: 'Должно быть строкой'})
  @Length(4, 16, {message: 'Не меньше 4 и не больше 16'})
  readonly birthday: string
}

export class Entity {
  @ApiProperty({example: 'true', description: 'ИП/Юр.лицо'})
  @IsBoolean({message: 'Должно быть булевым значением'})
  readonly isIndividual: boolean

  @ApiProperty({example: '586568956', description: 'Регистрационный номер/фискальный код'})
  @IsString({message: 'Должно быть строкой'})
  @Length(1, 16, {message: 'Не меньше 1 и не больше 16'})
  readonly code: string

  @ApiProperty({example: '34343', description: 'БИК банка'})
  @IsString({message: 'Должно быть строкой'})
  @Length(1, 16, {message: 'Не меньше 1 и не больше 16'})
  readonly bic: string

  @ApiProperty({example: '45454545455445', description: 'Номёр расчётного счёта'})
  @IsString({message: 'Должно быть строкой'})
  @Length(4, 16, {message: 'Не меньше 4 и не больше 16'})
  readonly check: string
}

export class CreateShelterDto {
  @ApiProperty({example: 'user@mail.com', description: 'Почта'})
  @IsString({message: 'Должно быть строкой'})
  @IsEmail({}, {message: 'Некорректный email'})
  readonly email: string;

  @ApiProperty({example: '12344556', description: 'Пароль'})
  @IsString({message: 'Должно быть строкой'})
  @Length(4, 16, {message: 'Не меньше 4 и не больше 16'})
  readonly password: string

  @ApiProperty({example: 'Борис', description: 'Имя или наименование продавца'})
  @IsString({message: 'Должно быть строкой'})
  @Length(1, 16, {message: 'Не меньше 1 и не больше 16'})
  readonly name: string

  @ApiProperty({example: '77546548', description: 'Номер продавца'})
  @IsString({message: 'Должно быть строкой'})
  @Length(7, 16, {message: 'Не меньше 1 и не больше 16'})
  readonly phone: string

  @ValidateNested()
  readonly closePerson: ClosePerson

  @ValidateNested()
  readonly personalData: PersonalData

  @ValidateNested()
  readonly entity: Entity
}

