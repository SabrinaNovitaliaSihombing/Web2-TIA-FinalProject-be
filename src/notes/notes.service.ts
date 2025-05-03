import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './note.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
    constructor(
        @InjectRepository(Note)
        private notesRepository: Repository<Note>,
    ) { }

    async create(createNoteDto: CreateNoteDto, userId: number): Promise<Note> {
        const newNote = this.notesRepository.create({
            ...createNoteDto,
            user_id: userId,
        });
        return this.notesRepository.save(newNote);
    }

    async findAllByUser(userId: number): Promise<Note[]> {
        return this.notesRepository.find({
            where: { user_id: userId },
            order: { updated_at: 'DESC' }, // Urutkan dari yang terakhir diubah
        });
    }

    async findOneByUser(id: number, userId: number): Promise<Note> {
        const note = await this.notesRepository.findOne({
            where: { id: id, user_id: userId },
        });

        if (!note) {
            throw new NotFoundException(`Note with ID ${id} not found.`);
        }
        return note;
    }

    async update(id: number, updateNoteDto: UpdateNoteDto, userId: number): Promise<Note> {
        const noteToUpdate = await this.findOneByUser(id, userId);
        Object.assign(noteToUpdate, updateNoteDto);
        return this.notesRepository.save(noteToUpdate);
    }

    async remove(id: number, userId: number): Promise<void> {
        const noteToRemove = await this.findOneByUser(id, userId);
        const result = await this.notesRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`Note with ID ${id} not found.`);
        }
    }
}