import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateTasksTable1742653296872 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      CREATE TABLE tasks (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          id_kategori INTEGER NULL, -- Kolom id_kategori, bisa null
          judul VARCHAR(255) NOT NULL,
          deskripsi TEXT NULL,
          due_date DATE NULL, -- Menggunakan tipe DATE untuk tanggal jatuh tempo
          status BOOLEAN NOT NULL DEFAULT FALSE, -- Default task belum selesai
          created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,

          -- Foreign key ke tabel users
          CONSTRAINT fk_user_task
              FOREIGN KEY(user_id)
              REFERENCES users(id)
              ON DELETE CASCADE, -- Jika user dihapus, task-nya ikut terhapus

          -- Foreign key ke tabel categories
          CONSTRAINT fk_category_task
              FOREIGN KEY(id_kategori)
              REFERENCES categories(id)
              ON DELETE SET NULL -- Jika kategori dihapus, task id_kategori jadi NULL
      );
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE tasks;`);
    }
}