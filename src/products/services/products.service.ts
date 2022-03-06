import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Product } from './../entities/product.entity';
import { CreateProductDto, FilterProducsDto, UpdateProductDto } from './../dtos/products.dtos';
import { Between, FindConditions, Repository } from 'typeorm';
import { BrandsService } from './brands.service';
import { Category } from '../entities/category.entity';
import { Brand } from '../entities/brand.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Brand)
    private readonly brandsRepository: Repository<Brand>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  findAll(params?: FilterProducsDto) {
    if (params) {
      const where: FindConditions<Product>={};
      const { limit, offset } = params;
      const { maxPrice, minPrice } = params;
      if (minPrice && maxPrice) {
        where.price = Between(minPrice, maxPrice);
      }
      return this.productsRepository.find({
        relations: ['brand'],
        where,
        take: limit,
        skip: offset,
      });
    }
    return this.productsRepository.find({ relations: ['brand'] });
  }

  async findOne(id: number) {
    const product = await this.productsRepository.findOne(id, {
      relations: ['brand', 'categories'],
    });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  async create(data: CreateProductDto) {
    const newProduct = this.productsRepository.create(data);
    if (data.brandId) {
      const brand = await this.brandsRepository.findOne(data.brandId);
      newProduct.brand = brand;
    }
    if (data.categoriesId) {
      const categories = await this.categoriesRepository.findByIds(
        data.categoriesId,
      );
      newProduct.categories = categories;
    }
    return this.productsRepository.save(newProduct);
  }

  async update(id: number, changes: UpdateProductDto) {
    const product = await this.productsRepository.findOne(id);
    if (changes.brandId) {
      const brand = await this.brandsRepository.findOne(changes.brandId);
      product.brand = brand;
    }
    if (changes.categoriesId) {
      const categories = await this.categoriesRepository.findByIds(
        changes.categoriesId,
      );
      product.categories = categories;
    }
    this.productsRepository.merge(product, changes);
    return this.productsRepository.save(product);
  }
  remove(id: number) {
    return this.productsRepository.delete(id);
  }
  async removeCategoryByProduct(id: number, categoryId: number) {
    const product = await this.productsRepository.findOne(id, {
      relations: ['categories'],
    });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    product.categories = product.categories.filter(
      (categoryItem) => categoryItem.id !== categoryId);
    console.log(product.categories);
    return this.productsRepository.save(product);
  }
  async AddCategoryByProduct(id: number, categoryId: number) {
    const product = await this.productsRepository.findOne(id, {
      relations: ['categories'],
    });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    const category = await this.categoriesRepository.findOne(categoryId);
    if (!category) {
      throw new NotFoundException(`Category #${categoryId} not found`);
    }
    product.categories.push(category);
    return this.productsRepository.save(product);
  }
}
