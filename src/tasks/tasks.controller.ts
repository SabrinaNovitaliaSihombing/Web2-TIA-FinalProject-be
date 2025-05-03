import {
    Controller,
    Get,
    Post,
    Body,
    Patch, // atau Put
    Param,
    Delete,
    UseGuards, // Untuk proteksi endpoint
    Req, // Untuk mendapatkan info user dari request (setelah login)
    ParseIntPipe, // Untuk validasi parameter ID (harus angka)
    HttpCode, // Untuk set status code (misal 204 No Content)
    HttpStatus,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger'; // Untuk dokumentasi API
import { Task } from './task.entity'; // Import entity untuk response type swagger

@ApiTags('Tasks') // Grouping di Swagger UI
@ApiBearerAuth() // Menandakan endpoint ini butuh token Bearer
@Controller('tasks') // Base path untuk controller ini adalah /tasks
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @Post() // Method: POST, Path: /tasks
    @ApiOperation({ summary: 'Buat task baru' })
    @ApiResponse({ status: 201, description: 'Task berhasil dibuat.', type: Task })
    @ApiResponse({ status: 400, description: 'Input tidak valid.' })
    @ApiResponse({ status: 401, description: 'Unauthorized (Token tidak valid/tidak ada).' })
    create(@Body() createTaskDto: CreateTaskDto, @Req() req): Promise<Task> {
        // Ambil user ID dari payload token JWT yang sudah diverifikasi oleh AuthGuard
        const userId = req.user.sub; // 'sub' biasanya berisi ID user
        return this.tasksService.create(createTaskDto, userId);
    }

    @Get() // Method: GET, Path: /tasks
    @ApiOperation({ summary: 'Dapatkan semua task milik user' })
    @ApiResponse({ status: 200, description: 'Daftar task berhasil diambil.', type: [Task] })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    findAll(@Req() req): Promise<Task[]> {
        const userId = req.user.sub;
        return this.tasksService.findAllByUser(userId);
    }

    @Get(':id') // Method: GET, Path: /tasks/{id}
    @ApiOperation({ summary: 'Dapatkan detail satu task berdasarkan ID' })
    @ApiResponse({ status: 200, description: 'Detail task.', type: Task })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'Task tidak ditemukan.' })
    findOne(@Param('id', ParseIntPipe) id: number, @Req() req): Promise<Task> {
        const userId = req.user.sub;
        return this.tasksService.findOneByUser(id, userId);
    }

    @Patch(':id') // Method: PATCH, Path: /tasks/{id} (PATCH lebih cocok untuk update sebagian)
    @ApiOperation({ summary: 'Update task berdasarkan ID' })
    @ApiResponse({ status: 200, description: 'Task berhasil diupdate.', type: Task })
    @ApiResponse({ status: 400, description: 'Input tidak valid.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'Task tidak ditemukan.' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateTaskDto: UpdateTaskDto,
        @Req() req,
    ): Promise<Task> {
        const userId = req.user.sub;
        return this.tasksService.update(id, updateTaskDto, userId);
    }

    @Delete(':id') // Method: DELETE, Path: /tasks/{id}
    @ApiOperation({ summary: 'Hapus task berdasarkan ID' })
    @ApiResponse({ status: 204, description: 'Task berhasil dihapus.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'Task tidak ditemukan.' })
    @HttpCode(HttpStatus.NO_CONTENT) // Set status code 204 jika berhasil
    async remove(@Param('id', ParseIntPipe) id: number, @Req() req): Promise<void> {
        const userId = req.user.sub;
        await this.tasksService.remove(id, userId);
        // Tidak return body content
    }
}