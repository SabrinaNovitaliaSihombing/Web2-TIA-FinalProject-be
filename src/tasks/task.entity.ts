import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity'; // Sesuaikan path jika perlu // Sesuaikan path jika perlu
import { Category } from 'src/categories/category.entity';

@Entity('tasks') // Nama tabel di database
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    // Kolom Foreign Key untuk User (pemilik task)
    @Column()
    user_id: number;

    // Kolom Foreign Key untuk Kategori (opsional)
    @Column({ nullable: true })
    id_kategori: number | null;

    @Column({ length: 255 })
    judul: string;

    @Column({ type: 'text', nullable: true })
    deskripsi: string;

    @Column({ type: 'date', nullable: true }) // Hanya tanggal, tanpa waktu
    due_date: string; // Bisa juga Date, tapi string YYYY-MM-DD sering lebih mudah

    @Column({ type: 'boolean', default: false })
    status: boolean; // false = belum selesai, true = sudah selesai

    @CreateDateColumn({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    // Relasi ke User (Many Tasks to One User)
    @ManyToOne(() => User, user => user.tasks, { onDelete: 'CASCADE' }) // Jika User dihapus, Task ikut terhapus
    @JoinColumn({ name: 'user_id' }) // Menentukan kolom join
    user: User;

    // Relasi ke Category (Many Tasks to One Category)
    @ManyToOne(() => Category, category => category.tasks, { nullable: true, onDelete: 'SET NULL' }) // Jika Category dihapus, id_kategori di Task jadi NULL
    @JoinColumn({ name: 'id_kategori' })
    category: Category | null;
}