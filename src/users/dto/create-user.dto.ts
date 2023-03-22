import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({example: 'user@mail.com', description: 'Почта'})
  readonly email: string;
  @ApiProperty({example: '12344556', description: 'Пароль'})
  readonly password: string
}