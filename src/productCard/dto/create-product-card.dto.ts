import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { MemoryStoredFile } from "nestjs-form-data/dist/classes/storage/MemoryStoredFile";

export class CategoriesDto {
  @ApiProperty({ example: 'Category', description: 'Category name' })
  @IsString()
  readonly category: string;

  @ApiProperty({ example: 'Subcategory', description: 'Subcategory name' })
  @IsString()
  readonly subcategory: string;

  @ApiProperty({ example: 'Section', description: 'Section name' })
  @IsString()
  readonly section: string;
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

export class CreateProductCardDto {
  @ApiProperty({ type: CategoriesDto, description: 'Product categories' })
  @ValidateNested()
  readonly categories: CategoriesDto;

  @ApiProperty({ type: Information, description: 'Product information' })
  @ValidateNested()
  readonly information: Information;

  @ApiProperty({ example: 'mainPhoto.jpg', description: 'Main product photo' })
  @IsString()
  readonly mainPhoto: MemoryStoredFile;

  @ApiProperty({ type: [MemoryStoredFile], description: 'Additional product photos' })
  @IsArray()
  @IsString({ each: true })
  readonly additionalPhotos: MemoryStoredFile[];

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
  }
