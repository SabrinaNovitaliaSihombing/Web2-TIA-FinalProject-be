import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from './category.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Category]), // Daftarkan Category entity
    ],
    controllers: [CategoriesController],
    providers: [CategoriesService],
    // exports: [CategoriesService] // Export jika service ini dibutuhkan module lain (misal Task)
})
export class CategoriesModule { }