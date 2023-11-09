import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, ValidateNested } from "class-validator";

class Buyer {
  @ApiProperty({ example: 'Иванов', description: 'Recipient\'s family' })
  @IsString()
  readonly family: string;

  @ApiProperty({ example: 'Евгений', description: 'Recipient\'s name' })
  @IsString()
  readonly name: string;

  @ApiProperty({ example: '77645678', description: 'Recipient\'s phone' })
  @IsString()
  readonly phone: string;
}

class DeliveryAddress {
  @ApiProperty({ example: 'Гагарина', description: 'Delivery street' })
  @IsString()
  readonly street: string;

  @ApiProperty({ example: '35', description: 'Delivery house' })
  @IsString()
  readonly house: string;

  @ApiProperty({ example: '3', description: 'Recipient\'s entrance' })
  @IsString()
  readonly entrance?: string;

  @ApiProperty({ example: '3', description: 'Recipient\'s floor' })
  @IsString()
  readonly floor?: string;

  @ApiProperty({ example: '3', description: 'Recipient\'s apartment' })
  @IsString()
  readonly apartment?: string;

  @ApiProperty({ example: 'Оставить у двери', description: 'Recipient\'s comment' })
  @IsString()
  readonly comment?: string;

  @ApiProperty({ example: 34, description: 'Shipping cost' })
  @IsNumber()
  readonly deliveryPrice?: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'Футболка зелёная', description: 'Name of product' })
  @IsString()
  goodName: string


  @ApiProperty({ example: '/card/product.jpg', description: 'Photo of product' })
  @IsString()
  goodPhoto: string

  @ApiProperty({ example: 'Product id', description: 'Product id' })
  @IsString()
  goodId: string

  @ApiProperty({ example: 'Type id', description: 'Type id' })
  @IsString()
  typeId: string

  @ApiProperty({ example: 'User id', description: 'User id' })
  userId: string | null

  @ApiProperty({ example: 'Shelter id', description: 'Shelter id' })
  @IsString()
  shelterId: string

  @ApiProperty({ example: 'Доставка', description: 'Order status' })
  @IsString()
  status: string

  @ApiProperty({ example: 'express', description: 'Способ доставки' })
  @IsString()
  deliveryMethod: 'pickup' | 'express' | 'doorstep'

  @ApiProperty({ example: 'express', description: 'Delivery method' })
  @IsString()
  paymentMethod: 'bankCard' | 'qrCode' | 'cash'

  @ApiProperty({ type: Buyer, description: 'Recipient data' })
  @ValidateNested()
  buyer: Buyer

  @ApiProperty({ example: 36.5, description: 'Good\'s price' })
  @IsNumber()
  price: number

  @ApiProperty({ example: 3, description: 'Good\'s count' })
  @IsNumber()
  count: number

  @ApiProperty({ example: 'Тирасполь', description: 'City\'s order' })
  @IsString()
  city: string

  @ApiProperty({ example: '6767_887', description: 'order unequal id' })
  @IsString()
  orderId: string

  @ApiProperty({ type: DeliveryAddress, description: 'Delivery address' })
  @ValidateNested()
  deliveryAddress?: DeliveryAddress | undefined
}
