import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { MongooseModule } from "@nestjs/mongoose";
import { Category, CategorySchema } from "./schemas/categories.schema";
import { Subcategory, SubcategorySchema } from "./schemas/subcategories.schema";
import { Section, SectionSchema } from "./schemas/sections.schema";

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports: [
    MongooseModule.forFeature([
      {name: Category.name, schema: CategorySchema},
      {name: Subcategory.name, schema: SubcategorySchema},
      {name: Section.name, schema: SectionSchema},
    ]),
  ],
  exports: [CategoriesService]
})
export class CategoriesModule {}
