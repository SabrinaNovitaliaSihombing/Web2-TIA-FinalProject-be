import { PartialType } from '@nestjs/swagger'; // Mengambil semua properti dari CreateTaskDto dan membuatnya opsional
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
    // Tidak perlu menambahkan apa-apa di sini
    // Semua properti dari CreateTaskDto sudah ada dan bersifat opsional
}