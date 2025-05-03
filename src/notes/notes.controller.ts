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
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Note } from './note.entity';

@ApiTags('Notes (Catatan)') // Nama di Swagger
@ApiBearerAuth()
@Controller('notes') // Base path /notes
export class NotesController {
    constructor(private readonly notesService: NotesService) { }

    @Post()
    @ApiOperation({ summary: 'Buat catatan baru' })
    @ApiResponse({ status: 201, description: 'Catatan berhasil dibuat.', type: Note })
    @ApiResponse({ status: 400, description: 'Input tidak valid.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    create(@Body() createNoteDto: CreateNoteDto, @Req() req): Promise<Note> {
        const userId = req.user.sub;
        return this.notesService.create(createNoteDto, userId);
    }

    @Get()
    @ApiOperation({ summary: 'Dapatkan semua catatan milik user' })
    @ApiResponse({ status: 200, description: 'Daftar catatan berhasil diambil.', type: [Note] })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    findAll(@Req() req): Promise<Note[]> {
        const userId = req.user.sub;
        return this.notesService.findAllByUser(userId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Dapatkan detail satu catatan berdasarkan ID' })
    @ApiResponse({ status: 200, description: 'Detail catatan.', type: Note })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'Catatan tidak ditemukan.' })
    findOne(@Param('id', ParseIntPipe) id: number, @Req() req): Promise<Note> {
        const userId = req.user.sub;
        return this.notesService.findOneByUser(id, userId);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update catatan berdasarkan ID' })
    @ApiResponse({ status: 200, description: 'Catatan berhasil diupdate.', type: Note })
    @ApiResponse({ status: 400, description: 'Input tidak valid.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'Catatan tidak ditemukan.' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateNoteDto: UpdateNoteDto,
        @Req() req,
    ): Promise<Note> {
        const userId = req.user.sub;
        return this.notesService.update(id, updateNoteDto, userId);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Hapus catatan berdasarkan ID' })
    @ApiResponse({ status: 204, description: 'Catatan berhasil dihapus.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'Catatan tidak ditemukan.' })
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id', ParseIntPipe) id: number, @Req() req): Promise<void> {
        const userId = req.user.sub;
        await this.notesService.remove(id, userId);
    }
}