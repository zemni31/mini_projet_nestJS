import { PrimaryGeneratedColumn } from 'typeorm';
import { TimestampedEntity } from './timestamped.entity';

export abstract class AbstractEntity extends TimestampedEntity {
    @PrimaryGeneratedColumn()
    id: number;
}