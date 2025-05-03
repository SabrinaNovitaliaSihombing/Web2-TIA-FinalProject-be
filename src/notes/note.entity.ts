import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity'; // Sesuaikan path

@Entity('notes') // Nama tabel sesuai migrasi
export class Note { // Nama class pakai konvensi Inggris
    @PrimaryGeneratedColumn()
    id: number;

    // Kolom Foreign Key untuk User (pemilik catatan)
    @Column()
    user_id: number;

    @Column({ length: 255 })
    judul: string;

    @Column({ type: 'text', nullable: true }) // Deskripsi boleh null
    deskripsi: string;

    @CreateDateColumn({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    // Relasi ke User (Many Notes to One User)
    @ManyToOne(() => User, user => user.notes, { onDelete: 'CASCADE' }) // Jika User dihapus, Note ikut terhapus
    @JoinColumn({ name: 'user_id' })
    user: User;
}