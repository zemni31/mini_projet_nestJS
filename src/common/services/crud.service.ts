import { NotFoundException } from '@nestjs/common';
import {
    DeepPartial,
    FindOptionsRelations,
    FindOptionsWhere,
    Repository,
} from 'typeorm';
import { AbstractEntity } from '../entities/abstract.entity';

export abstract class CrudService<T extends AbstractEntity> {
    constructor(
        protected readonly repository: Repository<T>,
        private readonly label: string,
        private readonly relations: FindOptionsRelations<T> = {},
    ) { }

    findAll(): Promise<T[]> {
        return this.repository.find({ relations: this.relations });
    }

    async findOne(id: number): Promise<T> {
        const entity = await this.repository.findOne({
            where: { id } as FindOptionsWhere<T>,
            relations: this.relations,
        });
        if (!entity) {
            throw new NotFoundException(`${this.label} d'id ${id} introuvable.`);
        }
        return entity;
    }

    async create(dto: DeepPartial<T>): Promise<T> {
        const saved = await this.repository.save(this.repository.create(dto));
        return this.findOne(saved.id);
    }

    async update(id: number, dto: DeepPartial<T>): Promise<T> {
        const entity = await this.repository.preload({
            ...dto,
            id,
        } as DeepPartial<T>);
        if (!entity) {
            throw new NotFoundException(`${this.label} d'id ${id} introuvable.`);
        }
        await this.repository.save(entity);
        return this.findOne(id);
    }

    async remove(id: number): Promise<{ message: string; id: number }> {
        const entity = await this.findOne(id);
        await this.repository.remove(entity);
        return { message: `${this.label} supprimé définitivement.`, id };
    }

    async softDelete(id: number): Promise<{ message: string; id: number }> {
        await this.findOne(id);
        await this.repository.softDelete(id);
        return { message: `${this.label} supprimé (suppression logique).`, id };
    }

    async restore(id: number): Promise<{ message: string; id: number }> {
        const entity = await this.repository.findOne({
            where: { id } as FindOptionsWhere<T>,
            withDeleted: true,
        });
        if (!entity) {
            throw new NotFoundException(`${this.label} d'id ${id} introuvable.`);
        }
        await this.repository.restore(id);
        return { message: `${this.label} restauré.`, id };
    }
}