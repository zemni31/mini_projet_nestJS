import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { CvEntity } from './entities/cv.entity';
import { SkillEntity } from '../skill/entities/SkillEntity';

@Module({
  imports: [TypeOrmModule.forFeature([CvEntity, SkillEntity])],
  controllers: [CvController],
  providers: [CvService],
  exports: [TypeOrmModule],
})
export class CvModule { }