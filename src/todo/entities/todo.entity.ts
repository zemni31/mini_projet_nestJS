import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StatusEnum } from '../enums/status.enum'; 
import { TimestampedEntity } from '../../common/entities/timestamped.entity';
@Entity('todos')
export class TodoEntity extends TimestampedEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 10 })
  name: string;

  @Column({ type: 'text' })
  description: string;

 
  @Column({
    type: 'simple-enum',
    enum: StatusEnum,
    default: StatusEnum.TODO,
  })
  status: StatusEnum;
}