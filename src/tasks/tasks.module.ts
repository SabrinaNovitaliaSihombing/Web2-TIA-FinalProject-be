import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './task.entity';
// Import Category jika repo Category di inject di service
// import { Category } from '../categories/category.entity';
// AuthModule tidak perlu di-import di sini jika AuthGuard sudah global atau diimport di AppModule

@Module({
    imports: [
        TypeOrmModule.forFeature([Task]), // Daftarkan Task entity agar repository-nya bisa di-inject
        // Jika service inject Category repo, tambahkan juga: TypeOrmModule.forFeature([Category]),
    ],
    controllers: [TasksController], // Daftarkan controller
    providers: [TasksService], // Daftarkan service
})
export class TasksModule { }