import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillService } from './skill.service';
import { SkillController } from './skill.controller';
import { SkillEntity } from './entities/SkillEntity';

@Module({
  imports: [TypeOrmModule.forFeature([SkillEntity])],
  controllers: [SkillController],
  providers: [SkillService],
  exports: [TypeOrmModule],
})
export class SkillModule { }