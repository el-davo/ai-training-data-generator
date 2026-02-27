import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'app_kv' })
export class AppKvEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  key!: string;

  @Column({ type: 'text' })
  value!: string;
}

