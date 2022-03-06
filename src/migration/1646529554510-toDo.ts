import {MigrationInterface, QueryRunner} from "typeorm";

export class toDo1646529554510 implements MigrationInterface {
    name = 'toDo1646529554510'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`task\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`created_At\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`update_At\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`description\` varchar(255) NOT NULL, \`limitDate\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`status\` enum ('to-do', 'doing', 'done') NOT NULL DEFAULT 'to-do', \`creatorUserId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`created_At\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`update_At\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`nickname\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`profile\` enum ('user', 'moderator', 'administrator') NOT NULL DEFAULT 'user', UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`refresh_token\` (\`id\` varchar(36) NOT NULL, \`expiresIn\` int NOT NULL, \`user_id\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tasks_users\` (\`taskId\` varchar(36) NOT NULL, \`userId\` varchar(36) NOT NULL, INDEX \`IDX_f85bfa2db65883ce21f52fe956\` (\`taskId\`), INDEX \`IDX_f6d8bf273b892dfcedfb3798a6\` (\`userId\`), PRIMARY KEY (\`taskId\`, \`userId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`task\` ADD CONSTRAINT \`FK_cc6fdd3fe4f9cc5358818629bf6\` FOREIGN KEY (\`creatorUserId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`tasks_users\` ADD CONSTRAINT \`FK_f85bfa2db65883ce21f52fe9567\` FOREIGN KEY (\`taskId\`) REFERENCES \`task\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`tasks_users\` ADD CONSTRAINT \`FK_f6d8bf273b892dfcedfb3798a65\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tasks_users\` DROP FOREIGN KEY \`FK_f6d8bf273b892dfcedfb3798a65\``);
        await queryRunner.query(`ALTER TABLE \`tasks_users\` DROP FOREIGN KEY \`FK_f85bfa2db65883ce21f52fe9567\``);
        await queryRunner.query(`ALTER TABLE \`task\` DROP FOREIGN KEY \`FK_cc6fdd3fe4f9cc5358818629bf6\``);
        await queryRunner.query(`DROP INDEX \`IDX_f6d8bf273b892dfcedfb3798a6\` ON \`tasks_users\``);
        await queryRunner.query(`DROP INDEX \`IDX_f85bfa2db65883ce21f52fe956\` ON \`tasks_users\``);
        await queryRunner.query(`DROP TABLE \`tasks_users\``);
        await queryRunner.query(`DROP TABLE \`refresh_token\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`task\``);
    }

}
