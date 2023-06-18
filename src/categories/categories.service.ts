import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
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

  async saveSections(sections: any) {
    const {parent, subs} = sections
    const parentCat = await this.subcategoryRepository.findOne({name: parent})
    for (let i = 0; i < subs.length; i++) {
      await this.sectionRepository.create({name: subs[i], parent: parentCat._id})
    }
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
      const category = await this.categoryRepository.findById(idCategories.category)
      category.productCards.push(productCard);
      await category.save();

      const subcategory = await this.subcategoryRepository.findById(idCategories.subcategory)
      subcategory.productCards.push(productCard);
      await subcategory.save();
      if (idCategories.section !== 'missing') {
        const section = await this.sectionRepository.findById(idCategories.section)
        section.productCards.push(productCard);
        await section.save();
      }

      return true
    } catch (e) {
      console.error('Error adding product card:', e)
      return false
    }
  }
}
