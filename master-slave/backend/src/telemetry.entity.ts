import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class TelemetryLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  machineId: string;

  @Column('float')
  oee: number;

  @Column('float')
  productivity: number;

  @Column()
  actualUnits: number;

  @Column()
  targetUnits: number;

  @Column('float')
  temp: number;

  @Column('float')
  presion: number;

  @Column()
  defects: number;

  @CreateDateColumn()
  createdAt: Date;
}
