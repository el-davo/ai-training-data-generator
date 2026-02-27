import { CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column()
  email!: string;

  @Column({ type: 'text' })
  passwordHash!: string;

  @CreateDateColumn()
  createdAt!: Date;
}

