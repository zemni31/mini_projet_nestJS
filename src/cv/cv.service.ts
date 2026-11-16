import {
  ForbiddenException, // ← NOUVEAU
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, In, Repository } from 'typeorm';
import { CrudService } from '../common/services/crud.service';
import { ConnectedUser } from '../common/interfaces/connected-user.interface'; // ← NOUVEAU
import { SkillEntity } from '../skill/entities/SkillEntity';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { CvEntity } from './entities/cv.entity';
import { CV_ERRORS } from './errors/cv.errors'; // ← NOUVEAU
import { ADMIN_ROLE } from '../common/common.constants';

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

  // ← NOUVEAU : vérifie que le Cv existe (sinon 404) et qu'il appartient à l'utilisateur connecté (sinon 403)
  private async assertOwner(
    id: number,
    user: ConnectedUser,
    withDeleted = false,
  ): Promise<void> {
    const cv = await this.repository.findOne({
      where: { id },
      relations: { user: true },
      withDeleted,
    });
    if (!cv) {
      throw new NotFoundException(CV_ERRORS.NOT_FOUND(id));
    }
    if (cv.user?.id !== user.userId) {
      throw new ForbiddenException(CV_ERRORS.NOT_OWNER);
    }
  }

  // ← MODIFIÉ : reçoit l'utilisateur connecté et l'affecte comme propriétaire
  async createCv(dto: CreateCvDto, user: ConnectedUser): Promise<CvEntity> {
    const { skillIds, ...data } = dto;
    const skills = await this.loadSkills(skillIds ?? []);
    return this.create({ ...data, skills, user: { id: user.userId } });
  }
  // Exercice 14 : l'admin voit tous les Cvs, un utilisateur seulement les siens
  findAllForUser(user: ConnectedUser): Promise<CvEntity[]> {
    if (user.role === ADMIN_ROLE) {
      return this.findAll();
    }
    return this.repository.find({
      where: { user: { id: user.userId } },
      relations: { skills: true },
    });
  }
  // ← MODIFIÉ : vérifie le propriétaire avant de modifier
  async updateCv(
    id: number,
    dto: UpdateCvDto,
    user: ConnectedUser,
  ): Promise<CvEntity> {
    await this.assertOwner(id, user);
    const { skillIds, ...data } = dto;
    const changes: DeepPartial<CvEntity> = { ...data };
    if (skillIds !== undefined) {
      changes.skills = await this.loadSkills(skillIds);
    }
    return this.update(id, changes);
  }

  // ← NOUVEAU : suppression définitive réservée au propriétaire
  async removeCv(id: number, user: ConnectedUser) {
    await this.assertOwner(id, user);
    return this.remove(id);
  }

  // ← NOUVEAU : suppression douce réservée au propriétaire
  async softDeleteCv(id: number, user: ConnectedUser) {
    await this.assertOwner(id, user);
    return this.softDelete(id);
  }

  // ← NOUVEAU : restauration réservée au propriétaire
  async restoreCv(id: number, user: ConnectedUser) {
    await this.assertOwner(id, user, true);
    return this.restore(id);
  }
    // Exercice 14 : l'admin voit n'importe quel Cv, un utilisateur seulement les siens
  async findOneForUser(id: number, user: ConnectedUser): Promise<CvEntity> {
    if (user.role !== ADMIN_ROLE) {
      await this.assertOwner(id, user);
    }
    return this.findOne(id);
  }
}