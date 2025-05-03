import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private categoriesRepository: Repository<Category>,
    ) { }

    async create(createCategoryDto: CreateCategoryDto, userId: number): Promise<Category> {
        // Cek dulu apakah nama kategori sudah ada untuk user ini
        const existingCategory = await this.categoriesRepository.findOne({
            where: { user_id: userId, nama: createCategoryDto.nama }
        });
        if (existingCategory) {
            throw new ConflictException(`Category with name "${createCategoryDto.nama}" already exists.`);
        }

        const newCategory = this.categoriesRepository.create({
            ...createCategoryDto,
            user_id: userId,
        });

        return this.categoriesRepository.save(newCategory);
    }

    async findAllByUser(userId: number): Promise<Category[]> {
        return this.categoriesRepository.find({
            where: { user_id: userId },
            order: { nama: 'ASC' }, // Urutkan berdasarkan nama A-Z
        });
    }

    async findOneByUser(id: number, userId: number): Promise<Category> {
        const category = await this.categoriesRepository.findOne({
            where: { id: id, user_id: userId },
        });

        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found.`);
        }
        return category;
    }

    async update(id: number, updateCategoryDto: UpdateCategoryDto, userId: number): Promise<Category> {
        const categoryToUpdate = await this.findOneByUser(id, userId);

        // Jika nama diubah, cek lagi potensi konflik nama
        if (updateCategoryDto.nama && updateCategoryDto.nama !== categoryToUpdate.nama) {
            const existingCategory = await this.categoriesRepository.findOne({
                where: { user_id: userId, nama: updateCategoryDto.nama }
            });
            if (existingCategory) {
                throw new ConflictException(`Category with name "${updateCategoryDto.nama}" already exists.`);
            }
        }

        Object.assign(categoryToUpdate, updateCategoryDto);
        try {
            return await this.categoriesRepository.save(categoryToUpdate);
        } catch (error) {
            // Handle error lain jika perlu, misal constraint DB
            if (error.code === '23505') { // Kode error PostgreSQL untuk unique violation
                throw new ConflictException(`Category name must be unique.`);
            }
            throw error; // Rethrow error lain
        }
    }

    async remove(id: number, userId: number): Promise<void> {
        const categoryToRemove = await this.findOneByUser(id, userId);
        // Relasi Task akan dihandle onDelete: SET NULL oleh database
        const result = await this.categoriesRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`Category with ID ${id} not found.`);
        }
    }
}