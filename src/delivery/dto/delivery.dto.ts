import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class DeliveryItemDto {
  @ApiProperty({ example: 'Тирасполь', description: 'Город доставки' })
  @IsString()
  city: string

  @ApiProperty({ example: '23.15', description: 'Цена доставки' })
  @IsString()
  price: string
}


export class CreateDeliveryDto {
  deliveryPoints: DeliveryItemDto[];
}
