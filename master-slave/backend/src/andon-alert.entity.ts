import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class AndonAlert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  lineName: string;

  @Column()
  status: string;

  @Column()
  message: string;

  @CreateDateColumn()
  createdAt: Date;
}
