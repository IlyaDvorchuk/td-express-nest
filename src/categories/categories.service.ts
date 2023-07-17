import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Category, CategoryDocument } from "./schemas/categories.schema";
import { Subcategory, SubcategoryDocument } from "./schemas/subcategories.schema";
import { Section, SectionDocument } from "./schemas/sections.schema";
import { CategoriesDto } from "../productCard/dto/create-product-card.dto";

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category.name) private categoryRepository: Model<CategoryDocument>,
              @InjectModel(Subcategory.name) private subcategoryRepository: Model<SubcategoryDocument>,
              @InjectModel(Section.name) private sectionRepository: Model<SectionDocument>) {
  }

  async saveSubcats(subcat: any) {
    // const {parent, subs} = subcats
    // const parentCat =  await this.categoryRepository.findOne({name: parent})
    // for (let i = 0; i < subs.length; i++) {
    //   await this.subcategoryRepository.create({name: subs[i], parent: parentCat._id})
    // }
    return await this.subcategoryRepository.create(subcat)
  }

  async saveCategory(category) {
    return await this.categoryRepository.create(category)
  }

  async saveSections(section: any) {
    // const {parent, subs} = sections
    // const parentCat = await this.subcategoryRepository.findOne({name: parent})
    // for (let i = 0; i < subs.length; i++) {
    //   await this.sectionRepository.create({name: subs[i], parent: parentCat._id})
    // }
    return await this.sectionRepository.create(section)
  }

  async cattoSub(dtoCat: any) {
    const subs = await this.subcategoryRepository.find({parent: dtoCat.id})
    const parent = await this.categoryRepository.findById(dtoCat.id)
    // @ts-ignore
    parent.children = subs.map(sub => sub._id)
    await parent.save()
    return parent
  }

  async subtoSec(dtoCat) {
    const secs = await this.sectionRepository.find({parent: dtoCat.id})
    const parent = await this.subcategoryRepository.findById(dtoCat.id)
    console.log('subs', secs);
    console.log('parent', parent);
    // @ts-ignore
    parent.children = secs.map(sec => sec._id)
    await parent.save()
    return parent
  }

  async getAll() {
    return await this.categoryRepository.find().populate({
      path: "children",
      populate: 'children'
    })
  }

  async addProductCard(idCategories: CategoriesDto, productCard) {
    try {
      const category = await this.categoryRepository.findById(idCategories.category.id)
      category.productCards.push(productCard);
      await category.save();

      const subcategory = await this.subcategoryRepository.findById(idCategories.subcategory.id)
      subcategory.productCards.push(productCard);
      await subcategory.save();
      if (idCategories.section.name.length > 0) {
        const section = await this.sectionRepository.findById(idCategories.section.id)
        section.productCards.push(productCard);
        await section.save();
      }

      return true
    } catch (e) {
      console.error('Error adding product card:', e)
      return false
    }
  }

  async updateCategories(dtoCategories, productCategories, product, id: string) {
    try {
      if (dtoCategories.category.id !== productCategories.category.id) {
        await this.updateCategory(this.categoryRepository, productCategories.category.id, id, product, dtoCategories.category.id);
      } else if (dtoCategories.subcategory.id !== productCategories.subcategory.id) {
        await this.updateCategory(this.subcategoryRepository, productCategories.subcategory.id, id, product, dtoCategories.subcategory.id);
      } else if (dtoCategories.section.id !== productCategories.section.id) {
        await this.updateCategory(this.sectionRepository, productCategories.section.id, id, product, dtoCategories.section.id);
      }
      return true
    } catch (e) {
     throw new Error(e)
    }
  }

  private async updateCategory(repository: Model<any>, oldCategoryId: string, id: string, product: any, newCategoryId: string) {
    const oldCategory = await repository.findById(oldCategoryId).exec();
    if (!oldCategory) {
      throw new Error('Old category not found.');
    }

    // Convert the string id to ObjectId
    const idToDelete = new Types.ObjectId(id).toString();

    // Filter out the element with the specified id from the productCards array
    oldCategory.productCards = oldCategory.productCards.filter((productId) => productId.toString() !== idToDelete);

    // Save the updated category document
    await oldCategory.save();

    const newCategory = await repository.findById(newCategoryId).exec();
    if (!newCategory) {
      throw new Error('New category not found.');
    }

    newCategory.productCards.push(product);
    await newCategory.save();
  }

  async removeProductCardFromCategories(productCardId: string): Promise<boolean> {
    try {
      const categoryUpdateResult = await this.categoryRepository.updateMany(
          { productCards: productCardId },
          { $pull: { productCards: productCardId } },
      );

      const subcategoryUpdateResult = await this.subcategoryRepository.updateMany(
          { productCards: productCardId },
          { $pull: { productCards: productCardId } },
      );

      // Удаляем карточку продукта из секций (если необязательно)
      this.sectionRepository.updateMany(
          { productCards: productCardId },
          { $pull: { productCards: productCardId } },
      ).catch(error => {
        console.error('Не удалось удалить карточку продукта из секций:', error);
      });

      // Проверяем результаты операций обновления в категориях и подкатегориях
      const isCategoryUpdateSuccessful = categoryUpdateResult.modifiedCount > 0;
      const isSubcategoryUpdateSuccessful = subcategoryUpdateResult.modifiedCount > 0;

      // Возвращаем true, если хотя бы одно обновление успешно
      return isCategoryUpdateSuccessful || isSubcategoryUpdateSuccessful;
    } catch (error) {
      // Обработка ошибок
      throw new Error('Не удалось удалить карточку товара из категорий');
    }
  }

}
