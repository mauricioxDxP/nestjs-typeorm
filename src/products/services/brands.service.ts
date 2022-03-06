import { Injectable, NotFoundException } from '@nestjs/common';

import { Brand } from '../entities/brand.entity';
import { CreateBrandDto, UpdateBrandDto } from '../dtos/brand.dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private brandsRepository: Repository<Brand>,
  ) {}

  findAll() {
    return this.brandsRepository.find();
  }

  findOne(id: number) {
    return this.brandsRepository.findOne(id, { relations: ['products'] });
  }

  async create(data: CreateBrandDto) {
    const brand = await this.brandsRepository.create(data);
    return this.brandsRepository.save(brand);
  }

  async update(id: number, changes: UpdateBrandDto) {
    const brand = await this.brandsRepository.findOne(id);
    this.brandsRepository.merge(brand, changes);
    return this.brandsRepository.save(brand);
  }

  remove(id: number) {
    return this.brandsRepository.delete(id);
  }
}
