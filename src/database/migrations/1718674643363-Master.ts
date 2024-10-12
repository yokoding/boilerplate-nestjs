import { MigrationInterface, QueryRunner } from 'typeorm';

export class Master1718674643363 implements MigrationInterface {
  name = 'Master1718674643363';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    await queryRunner.query(
      `CREATE TABLE "files" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
        "name" character varying,
        "filename" character varying,
        "url" character varying NOT NULL,
        "adapter" character varying,
        "type" character varying,
        "height" integer,
        "width" integer,
        "size" integer,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "files"`);
  }
}
