import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateCategoriesTable1742653296871 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      CREATE TABLE categories (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          nama VARCHAR(100) NOT NULL,
          warna VARCHAR(50), -- Cukup untuk hex code (#RRGGBB) atau nama warna
          created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,

          -- Foreign key ke tabel users
          CONSTRAINT fk_user_category
              FOREIGN KEY(user_id)
              REFERENCES users(id)
              ON DELETE CASCADE, -- Jika user dihapus, kategorinya ikut terhapus

          -- Opsional: Pastikan nama kategori unik untuk setiap user
          CONSTRAINT uq_user_category_nama UNIQUE (user_id, nama)
      );
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE categories;`);
    }
}