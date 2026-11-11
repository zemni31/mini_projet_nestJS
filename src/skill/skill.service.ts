import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrudService } from '../common/services/crud.service';
import { SkillEntity } from './entities/SkillEntity';

@Injectable()
export class SkillService extends CrudService<SkillEntity> {
  constructor(
    @InjectRepository(SkillEntity)
    repository: Repository<SkillEntity>,
  ) {
    super(repository, 'Skill');
  }
}