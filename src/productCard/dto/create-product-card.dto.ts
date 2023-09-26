import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ValidateNested, IsNumber, IsBoolean } from 'class-validator';
import { MemoryStoredFile } from "nestjs-form-data/dist/classes/storage/MemoryStoredFile";
import { NotificationDocument } from 'src/notification/notification.schema';

export class Category {
  @ApiProperty({ example: 'Category', description: 'Category id' })
  @IsString()
  readonly id: string;

  @ApiProperty({ example: 'Category', description: 'Category name' })
  @IsString()
  readonly name: string;
}

export class CategoriesDto {
  @ApiProperty({ type: Category, example: 'Category', description: 'Category name' })
  @ValidateNested()
  readonly category: Category;

  @ApiProperty({ type: Category, example: 'Subcategory', description: 'Subcategory name' })
  @ValidateNested()
  @IsString()
  readonly subcategory: Category;

  @ApiProperty({ type: Category, example: 'Section', description: 'Section name' })
  @ValidateNested()
  @IsString()
  readonly section: Category;
}

class Information {
  @ApiProperty({ example: 'Product name', description: 'Product name' })
  @IsString()
  readonly name: string;

  @ApiProperty({ example: 'Product description', description: 'Product description' })
  @IsString()
  readonly description: string;
}

class Dimensions {
  @ApiProperty({ example: 10, description: 'Product length' })
  @IsNumber()
  readonly length: number;

  @ApiProperty({ example: 5, description: 'Product width' })
  @IsNumber()
  readonly width: number;

  @ApiProperty({ example: 3, description: 'Product height' })
  @IsNumber()
  readonly height: number;

  @ApiProperty({ example: 1.5, description: 'Product weight' })
  @IsNumber()
  readonly weight: number;
}

class PricesAndQuantity {
  @ApiProperty({ example: 9.99, description: 'Product price' })
  @IsNumber()
  readonly price: number;

  @ApiProperty({ example: 14.99, description: 'Product price before discount' })
  @IsNumber()
  readonly priceBeforeDiscount: number;

  @ApiProperty({ example: 50, description: 'Product quantity' })
  @IsNumber()
  readonly quantity: number;
}

class AdditionalInformation {
  @ApiProperty({ example: 'Material', description: 'Product material' })
  @IsString()
  readonly material: string;

  @ApiProperty({ example: 'Recommendations', description: 'Product recommendations' })
  @IsString()
  readonly recommendations: string;
}

class DeliveryPoints {
  @ApiProperty({ example: 'Delivery point 1', description: 'Delivery point name' })
  @IsString()
  readonly name: string;

  @ApiProperty({ example: 'Address 1', description: 'Delivery point address' })
  @IsString()
  readonly address: string;
}

class Color {
  @ApiProperty({ example: 'Красный', description: 'Название цвета' })
  @IsString()
  readonly name: string;

  @ApiProperty({ example: '#FFF', description: 'Описание цвета' })
  @IsString()
  readonly color: string;

  @ApiProperty({ example: 'Беспорядочный набор символов', description: 'Фотография' })
  @IsString()
  image?: string | undefined;
}

class SizeQuantity {
  @ApiProperty({ example: 'XXL', description: 'Размер' })
  @IsString()
  readonly size: string;

  @ApiProperty({ example: '45', description: 'Количество' })
  @IsString()
  readonly quantity: string

  @ApiProperty({ type: Color, description: 'Product colors' })
  @ValidateNested()
  readonly color?: Color | undefined
}

class Colors {
  @ApiProperty({ example: 'XXL', description: 'Размер' })
  @IsString()
  readonly name: string;

  @ApiProperty({ example: 'Беспорядочный набор символов', description: 'Фотография' })
  @IsString()
   readonly image: string
}


export class CreateProductCardDto {
  @ApiProperty({ type: CategoriesDto, description: 'Product categories' })
  @ValidateNested()
  readonly categories: CategoriesDto;

  @ApiProperty({ type: Information, description: 'Product information' })
  @ValidateNested()
  readonly information: Information;

  @ApiProperty({ example: 'mainPhoto.jpg', description: 'Main product photo' })
  @IsString()
  readonly mainPhoto: MemoryStoredFile | string;

  @ApiProperty({ type: [MemoryStoredFile], description: 'Additional product photos' })
  @IsArray()
  @IsString({ each: true })
  readonly additionalPhotos: MemoryStoredFile[] | string[];

  @ApiProperty({ type: Dimensions, description: 'Product dimensions' })
  @ValidateNested()
  readonly dimensions: Dimensions;

  @ApiProperty({ type: PricesAndQuantity, description: 'Product prices and quantity' })
  @ValidateNested()
  readonly pricesAndQuantity: PricesAndQuantity;

  @ApiProperty({ type: AdditionalInformation, description: 'Additional product information' })
  @ValidateNested()
  readonly additionalInformation: AdditionalInformation;

  @ApiProperty({ type: [DeliveryPoints], description: 'Delivery points' })
  @ValidateNested({ each: true })
  readonly deliveryPoints: DeliveryPoints[];

  @ApiProperty({ example: 'Delivery point 1', description: 'Delivery point name' })
  readonly comments: Comment[];

  @ApiProperty({ example: 'Delivery point 1', description: 'Delivery point name' })
  @IsBoolean()
  readonly published: boolean;

  @ApiProperty({ example: 'Delivery point 1', description: 'Delivery point name' })
  @ValidateNested()
  readonly notifications: NotificationDocument[];

  @ApiProperty({ example: 'Delivery point 1', description: 'Delivery point name' })
  @IsNumber()
  readonly purchaseCount: number;

  @ApiProperty({ example: 'Delivery point 1', description: 'Delivery point name' })
  @ValidateNested()
  readonly typeQuantity?: SizeQuantity[]

  @ApiProperty({ example: 'Delivery point 1', description: 'Delivery point name' })
  @ValidateNested()
  colors?: (Colors | undefined)[]
}

export class UpdateProductCardDto extends CreateProductCardDto {
  @ApiProperty({ example: 'fgd08fdg8gfddfg', description: 'id товара' })
  @IsString()
  readonly _id: string
}
