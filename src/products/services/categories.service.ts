import { Injectable, NotFoundException } from '@nestjs/common';

import { Category } from '../entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/category.dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {

  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  findAll() {
    return this.categoryRepository.find();
  }

  findOne(id: number) {
    return this.categoryRepository.findOne(id, { relations: ['products'] });
  }

  async create(data: CreateCategoryDto) {
    const category = await this.categoryRepository.create(data);
    return this.categoryRepository.save(category);
  }

  async update(id: number, changes: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOne(id);
    this.categoryRepository.merge(category, changes);
    return this.categoryRepository.save(category);
  }

  remove(id: number) {
    return this.categoryRepository.delete(id);
  }

}
