import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsString,
    MaxLength,
    IsOptional,
    IsInt,
    IsDateString, // Untuk validasi format YYYY-MM-DD
    IsBoolean,
} from 'class-validator';

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    @ApiProperty({ example: 'Selesaikan Laporan Bulanan', description: 'Judul task yang harus diisi' })
    judul: string;

    @IsString()
    @IsOptional() // Boleh kosong
    @ApiProperty({ example: 'Kumpulkan data penjualan dan buat ringkasan.', description: 'Deskripsi detail task (opsional)', required: false })
    deskripsi?: string;

    @IsInt()
    @IsOptional() // Boleh kosong
    @ApiProperty({ example: 1, description: 'ID Kategori yang sudah ada (opsional)', required: false })
    id_kategori?: number;

    @IsDateString() // Harus format 'YYYY-MM-DD'
    @IsOptional() // Boleh kosong
    @ApiProperty({ example: '2024-12-31', description: 'Tanggal jatuh tempo (opsional)', required: false })
    due_date?: string;

    // Status biasanya tidak di set saat create, defaultnya false (belum selesai)
    // Tapi bisa ditambahkan jika ingin bisa set status saat create
    @IsBoolean()
    @IsOptional()
    @ApiProperty({ example: false, description: 'Status selesai task (opsional, default false)', required: false })
    status?: boolean = false;
}