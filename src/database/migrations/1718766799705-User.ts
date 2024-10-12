import { MigrationInterface, QueryRunner } from 'typeorm';

export class User1718766799705 implements MigrationInterface {
  name = 'User1718766799705';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "roles" (
        "id" SERIAL NOT NULL PRIMARY KEY,
        "name" character varying NOT NULL,
        "status" integer,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP)`,
    );

    await queryRunner.query(
      `CREATE TABLE "users" (
        "id" SERIAL NOT NULL PRIMARY KEY,
        "name" character varying NOT NULL,
        "email" character varying UNIQUE,
        "email_verified_at" TIMESTAMP,
        "username" character varying,
        "password" character varying,
        "phone" character varying,
        "pob" character varying,
        "dob" date,
        "address" character varying,
        "provider" character varying NOT NULL DEFAULT 'email',
        "socialId" character varying,
        "hash" character varying,
        "avatarId" uuid,
        "roleId" integer,
        "status" integer,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9bd2fe7a8e694dedc4ec2f666f" ON "users" ("socialId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e282acb94d2e3aec10f480e4f6" ON "users" ("hash") `,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_75e2be4ce11d447ef43be0e374f" FOREIGN KEY ("avatarId") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `CREATE TABLE "sessions" (
        "id" SERIAL NOT NULL PRIMARY KEY,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP,
        "userId" integer)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3d2f174ef04fb312fdebd0ddc5" ON "sessions" ("userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `CREATE TABLE "forgot_passwords" (
        "id" SERIAL NOT NULL PRIMARY KEY,
        "hash" character varying NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP,
        "userId" integer)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_df507d27b0fb20cd5f7bef9b9a" ON "forgot_passwords" ("hash") `,
    );
    await queryRunner.query(
      `ALTER TABLE "forgot_passwords" ADD CONSTRAINT "FK_31f3c80de0525250f31e23a9b83" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3d2f174ef04fb312fdebd0ddc5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_df507d27b0fb20cd5f7bef9b9a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "forgot_passwords" DROP CONSTRAINT "FK_31f3c80de0525250f31e23a9b83"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9bd2fe7a8e694dedc4ec2f666f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e282acb94d2e3aec10f480e4f6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_75e2be4ce11d447ef43be0e374f"`,
    );

    await queryRunner.query(`DROP TABLE "sessions"`);
    await queryRunner.query(`DROP TABLE "forgot_passwords"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "roles"`);
  }
}
