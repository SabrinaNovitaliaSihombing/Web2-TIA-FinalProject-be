import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator';

export class CreateNoteDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    @ApiProperty({ example: 'Ide Proyek Sampingan', description: 'Judul catatan yang harus diisi' })
    judul: string;

    @IsString()
    @IsOptional() // Boleh kosong
    @ApiProperty({ example: 'Membuat aplikasi todo list sederhana pakai NestJS.', description: 'Deskripsi catatan (opsional)', required: false })
    deskripsi?: string;
}