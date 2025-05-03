import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator';

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @ApiProperty({ example: 'Pekerjaan', description: 'Nama kategori yang harus diisi' })
    nama: string;

    @IsString()
    @IsOptional() // Boleh kosong
    @MaxLength(50) // Cukup untuk hex code (#RRGGBB) atau nama warna
    @ApiProperty({ example: '#FF5733', description: 'Warna kategori (opsional)', required: false })
    warna?: string;
}