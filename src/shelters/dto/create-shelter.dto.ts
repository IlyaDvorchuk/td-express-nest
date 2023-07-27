import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsString, Length, ValidateNested } from "class-validator";
import { HasMimeType, IsFile, MaxFileSize, MemoryStoredFile } from "nestjs-form-data";

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
  readonly phoneClose: string
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

export class ShelterDataDto {
  @ValidateNested()
  readonly closePerson: ClosePerson

  @ValidateNested()
  readonly personalData: PersonalData

  @ValidateNested()
  readonly entity: Entity
}

export class DeliveryPoint {
  @ApiProperty({example: 'Тирасполь', description: 'Населённый пункт'})
  @IsString({message: 'Должно быть строкой'})
  @Length(1, 16, {message: 'Не меньше 1 и не больше 125'})
  readonly city: string

  @ApiProperty({example: 'ул. Колотушкина, д. Пушкина', description: 'Адрес магазина'})
  @IsString({message: 'Должно быть строкой'})
  @Length(1, 5000, {message: 'Не меньше 1 и не больше 5000'})
  readonly address: string

  @ApiProperty({example: 'У Витька', description: 'Название торговой точки'})
  @IsString({message: 'Должно быть строкой'})
  @Length(1, 40, {message: 'Не меньше 1 и не больше 5000'})
  readonly shopName?: string

  @ApiProperty({example: 'В подвале кожвена', description: 'Примечания'})
  @IsString({message: 'Должно быть строкой'})
  @Length(1, 5000, {message: 'Не меньше 1 и не больше 5000'})
  readonly notes?: string
}

export class ShelterShop {
  @ApiProperty({example: 'Пятёрочка', description: 'Название магазина'})
  @IsString({message: 'Должно быть строкой'})
  @Length(1, 16, {message: 'Не меньше 1 и не больше 16'})
  readonly name: string

  @ApiProperty({example: 'Лучший магазин', description: 'Описание магазина'})
  @IsString({message: 'Должно быть строкой'})
  @Length(1, 5000, {message: 'Не меньше 1 и не больше 5000'})
  readonly description: string
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

  // @ApiProperty({example: 'Фото(скан)', description: 'Фото ИП или юр.лица продавцп'})
  // @IsFile()
  // @MaxFileSize ( 1e6 )
  // @HasMimeType ( [ 'image / jpeg' , ' image/png ' ] )
  // readonly fileScan: MemoryStoredFile

  @ApiProperty({example: 'Логотип магазина', description: 'Логотип магазина'})
  @IsFile()
  @MaxFileSize ( 1e6 )
  @HasMimeType ( [ 'image / jpeg' , ' image/png ' ] )
  readonly imageShop: MemoryStoredFile

  @ValidateNested()
  readonly shelterData: ShelterDataDto

  @ValidateNested()
  readonly shop: ShelterShop

  @ValidateNested()
  readonly deliveryPoints: DeliveryPoint[]
}
