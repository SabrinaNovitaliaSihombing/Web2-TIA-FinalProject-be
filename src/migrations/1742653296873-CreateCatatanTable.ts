import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateCatatanTable1742653296873 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      CREATE TABLE notes (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL, -- Menambahkan user_id untuk relasi ke user
          judul VARCHAR(255) NOT NULL,
          deskripsi TEXT NULL,
          created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,

          -- Foreign key ke tabel users
          CONSTRAINT fk_user_catatan
              FOREIGN KEY(user_id)
              REFERENCES users(id)
              ON DELETE CASCADE -- Jika user dihapus, catatannya ikut terhapus
      );
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE catatan;`);
    }
}