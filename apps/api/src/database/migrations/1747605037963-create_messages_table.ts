import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMessagesTable1747605037963 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        content TEXT NOT NULL,
        sender ENUM('user', 'assistant') NOT NULL,
        user_id INT NULL,
        conversation_id INT NOT NULL,
        is_active BOOLEAN DEFAULT true,
        external_id VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT FK_conversation_message FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
        CONSTRAINT FK_user_message FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE messages;
    `);
  }
}
