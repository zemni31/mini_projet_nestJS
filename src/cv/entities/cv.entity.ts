import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { AbstractEntity } from '../../common/entities/abstract.entity';
import { SkillEntity } from '../../skill/entities/SkillEntity';

@Entity('cvs')
export class CvEntity extends AbstractEntity {
    @Column({ length: 50 })
    name: string;

    @Column({ length: 50 })
    firstname: string;

    @Column({ type: 'int' })
    age: number;

    @Column({ length: 20 })
    cin: string;

    @Column({ length: 100 })
    job: string;

    @Column({ type: 'varchar', nullable: true }) // nullable: le chemin du fichier du CV peut ne pas exister à la création 
    path: string | null;

    @ManyToMany(() => SkillEntity, (skill) => skill.cvs) // Un Cv a plusieurs compétences et une compétence appartient à plusieurs Cvs
    @JoinTable({ name: 'cv_skills' })
    skills: SkillEntity[];
}