import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
    Index, // Import Index
} from 'typeorm';
import { User } from '../user/user.entity'; // Sesuaikan path
import { Task } from '../tasks/task.entity'; // Sesuaikan path

@Entity('categories') // Nama tabel di database
@Index(['user_id', 'nama'], { unique: true }) // Nama kategori harus unik per user
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    // Kolom Foreign Key untuk User (pemilik kategori)
    @Column()
    user_id: number;

    @Column({ length: 100 })
    nama: string;

    @Column({ length: 50, nullable: true }) // Warna boleh null
    warna: string;

    @CreateDateColumn({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    // Relasi ke User (Many Categories to One User)
    @ManyToOne(() => User, user => user.categories, { onDelete: 'CASCADE' }) // Jika User dihapus, Category ikut terhapus
    @JoinColumn({ name: 'user_id' })
    user: User;

    // Relasi ke Task (One Category to Many Tasks)
    @OneToMany(() => Task, task => task.category) // Relasi ini untuk kemudahan query, task akan dihandle onDelete SET NULL
    tasks: Task[];
}