import { Column, Entity, ManyToMany } from 'typeorm';
import { AbstractEntity } from '../../common/entities/abstract.entity';
import { CvEntity } from '../../cv/entities/cv.entity';

@Entity('skills')
export class SkillEntity extends AbstractEntity {
  @Column({ length: 50 })
  designation: string;

  @ManyToMany(() => CvEntity, (cv) => cv.skills)
  cvs: CvEntity[];
}