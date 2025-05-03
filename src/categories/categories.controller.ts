import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req,
    ParseIntPipe,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Category } from './category.entity';

@ApiTags('Categories')
@ApiBearerAuth()
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Post()
    @ApiOperation({ summary: 'Buat kategori baru' })
    @ApiResponse({ status: 201, description: 'Kategori berhasil dibuat.', type: Category })
    @ApiResponse({ status: 400, description: 'Input tidak valid.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 409, description: 'Nama kategori sudah ada.' }) // Conflict
    create(@Body() createCategoryDto: CreateCategoryDto, @Req() req): Promise<Category> {
        const userId = req.user.sub;
        return this.categoriesService.create(createCategoryDto, userId);
    }

    @Get()
    @ApiOperation({ summary: 'Dapatkan semua kategori milik user' })
    @ApiResponse({ status: 200, description: 'Daftar kategori berhasil diambil.', type: [Category] })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    findAll(@Req() req): Promise<Category[]> {
        const userId = req.user.sub;
        return this.categoriesService.findAllByUser(userId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Dapatkan detail satu kategori berdasarkan ID' })
    @ApiResponse({ status: 200, description: 'Detail kategori.', type: Category })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'Kategori tidak ditemukan.' })
    findOne(@Param('id', ParseIntPipe) id: number, @Req() req): Promise<Category> {
        const userId = req.user.sub;
        return this.categoriesService.findOneByUser(id, userId);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update kategori berdasarkan ID' })
    @ApiResponse({ status: 200, description: 'Kategori berhasil diupdate.', type: Category })
    @ApiResponse({ status: 400, description: 'Input tidak valid.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'Kategori tidak ditemukan.' })
    @ApiResponse({ status: 409, description: 'Nama kategori sudah ada.' }) // Conflict
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateCategoryDto: UpdateCategoryDto,
        @Req() req,
    ): Promise<Category> {
        const userId = req.user.sub;
        return this.categoriesService.update(id, updateCategoryDto, userId);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Hapus kategori berdasarkan ID' })
    @ApiResponse({ status: 204, description: 'Kategori berhasil dihapus.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'Kategori tidak ditemukan.' })
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id', ParseIntPipe) id: number, @Req() req): Promise<void> {
        const userId = req.user.sub;
        await this.categoriesService.remove(id, userId);
    }
}