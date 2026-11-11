import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, In, Repository } from 'typeorm';
import { CrudService } from '../common/services/crud.service';
import { SkillEntity } from '../skill/entities/SkillEntity';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { CvEntity } from './entities/cv.entity';

@Injectable()
export class CvService extends CrudService<CvEntity> {
  constructor(
    @InjectRepository(CvEntity)
    repository: Repository<CvEntity>,
    @InjectRepository(SkillEntity)
    private readonly skillRepository: Repository<SkillEntity>,
  ) {
    super(repository, 'Cv', { skills: true });
  }

  private async loadSkills(skillIds: number[]): Promise<SkillEntity[]> {
    const ids = [...new Set(skillIds)];
    if (ids.length === 0) {
      return [];
    }
    const skills = await this.skillRepository.findBy({ id: In(ids) });
    if (skills.length !== ids.length) {
      const found = skills.map((skill) => skill.id);
      const missing = ids.filter((id) => !found.includes(id));
      throw new NotFoundException(
        `Compétence(s) introuvable(s) : ${missing.join(', ')}.`,
      );
    }
    return skills;
  }

  async createCv(dto: CreateCvDto): Promise<CvEntity> {
    const { skillIds, ...data } = dto;
    const skills = await this.loadSkills(skillIds ?? []);
    return this.create({ ...data, skills });
  }

  async updateCv(id: number, dto: UpdateCvDto): Promise<CvEntity> {
    const { skillIds, ...data } = dto;
    const changes: DeepPartial<CvEntity> = { ...data };
    if (skillIds !== undefined) {
      changes.skills = await this.loadSkills(skillIds);
    }
    return this.update(id, changes);
  }
}