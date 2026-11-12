import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CvEntity } from '../../cv/entities/cv.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 20 })
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar',default: 'user' })
  role: string;

  @OneToMany(() => CvEntity, (cv) => cv.user)
  cvs: CvEntity[];
}