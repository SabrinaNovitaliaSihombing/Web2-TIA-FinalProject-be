import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
// Import Category jika perlu validasi tambahan, tapi untuk simple CRUD kita skip dulu
// import { Category } from '../categories/category.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task) // Inject repository Task
        private tasksRepository: Repository<Task>,
        // Jika butuh validasi kategori, inject juga repo Category
        // @InjectRepository(Category)
        // private categoriesRepository: Repository<Category>,
    ) { }

    // Membuat Task baru untuk User tertentu
    async create(createTaskDto: CreateTaskDto, userId: number): Promise<Task> {
        // Opsional: Validasi apakah id_kategori ada dan milik user (jika id_kategori diberikan)
        // if (createTaskDto.id_kategori) {
        //   const category = await this.categoriesRepository.findOne({ where: { id: createTaskDto.id_kategori, user_id: userId }});
        //   if (!category) {
        //     throw new NotFoundException(`Category with ID ${createTaskDto.id_kategori} not found for this user.`);
        //   }
        // }

        const newTask = this.tasksRepository.create({
            ...createTaskDto, // Ambil semua data dari DTO
            user_id: userId, // Set user_id dari user yang login
            id_kategori: createTaskDto.id_kategori ?? null, // Pastikan null jika tidak ada
            // status default sudah di handle entity atau DTO
        });

        return this.tasksRepository.save(newTask);
    }

    // Mencari semua Task milik User tertentu
    async findAllByUser(userId: number): Promise<Task[]> {
        return this.tasksRepository.find({
            where: { user_id: userId }, // Filter berdasarkan user_id
            order: { created_at: 'DESC' }, // Urutkan dari terbaru
            relations: ['category'], // Sertakan data kategori (jika ada)
        });
    }

    // Mencari satu Task spesifik milik User tertentu
    async findOneByUser(id: number, userId: number): Promise<Task> {
        const task = await this.tasksRepository.findOne({
            where: { id: id, user_id: userId }, // Cari berdasarkan ID task dan ID user
            relations: ['category'], // Sertakan data kategori
        });

        if (!task) {
            // Jika task tidak ditemukan atau bukan milik user ini
            throw new NotFoundException(`Task with ID ${id} not found.`);
        }
        return task;
    }

    // Mengupdate Task spesifik milik User tertentu
    async update(id: number, updateTaskDto: UpdateTaskDto, userId: number): Promise<Task> {
        // Pertama, cari dulu tasknya untuk memastikan ada dan milik user
        const taskToUpdate = await this.findOneByUser(id, userId);

        // Opsional: Validasi id_kategori jika diubah
        // if (updateTaskDto.id_kategori !== undefined) { // Cek jika id_kategori ada di DTO update
        //   if (updateTaskDto.id_kategori === null) {
        //     // User ingin menghapus kategori
        //   } else {
        //      const category = await this.categoriesRepository.findOne({ where: { id: updateTaskDto.id_kategori, user_id: userId }});
        //      if (!category) {
        //        throw new NotFoundException(`Cannot assign Category with ID ${updateTaskDto.id_kategori}. Not found for this user.`);
        //      }
        //   }
        // }

        // Gabungkan data lama dengan data baru dari DTO
        Object.assign(taskToUpdate, updateTaskDto);

        // Jika id_kategori di DTO adalah null secara eksplisit, pastikan itu diterapkan
        if (updateTaskDto.id_kategori === null) {
            taskToUpdate.id_kategori = null;
        }


        return this.tasksRepository.save(taskToUpdate);
    }

    // Menghapus Task spesifik milik User tertentu
    async remove(id: number, userId: number): Promise<void> {
        // Cari dulu untuk memastikan ada dan milik user
        const taskToRemove = await this.findOneByUser(id, userId);

        const result = await this.tasksRepository.delete(id);

        if (result.affected === 0) {
            // Seharusnya tidak terjadi karena sudah dicek findOneByUser
            throw new NotFoundException(`Task with ID ${id} not found.`);
        }
        // Tidak perlu return apa-apa (void)
    }
}