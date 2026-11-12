import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  randFilePath,
  randFirstName,
  randJobTitle,
  randLastName,
  randNumber,
  randSkill,
  randUserName,
} from '@ngneat/falso';
import { AppModule } from '../app.module';
import { AuthService } from '../auth/auth.service';
import { UserEntity } from '../auth/entities/user.entity';
import { SkillService } from '../skill/skill.service';
import { SkillEntity } from '../skill/entities/SkillEntity';
import { CvService } from '../cv/cv.service';

const NB_USERS = 5;
const NB_SKILLS = 10;
const MAX_CVS_PAR_USER = 3;
const MOT_DE_PASSE = 'Password123!';
const ADMIN = { username: 'admin', email: 'admin@cv.tn', password: 'Admin123!' };

type UserSansMotDePasse = Omit<UserEntity, 'password'>;

// Vide les tables du TP2 et remet les compteurs d'id à 1
async function viderBase(dataSource: DataSource): Promise<void> {
  await dataSource.query(
    'TRUNCATE TABLE "cv_skills", "cvs", "skills", "users" RESTART IDENTITY CASCADE',
  );
}

// username unique, sans accents, 20 caractères maximum (contrainte de UserEntity)
function genererUsername(index: number): string {
  const base = randUserName({ withAccents: false })
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase();
  return `${base.slice(0, 16)}${index}`;
}

// Choisit n éléments différents au hasard dans une liste
function choisirAuHasard<T>(liste: T[], n: number): T[] {
  return [...liste].sort(() => Math.random() - 0.5).slice(0, n);
}

async function seedUsers(
  authService: AuthService,
  userRepository: Repository<UserEntity>,
): Promise<UserSansMotDePasse[]> {
  const admin = await authService.inscri(ADMIN);
  await userRepository.update(admin.id, { role: 'admin' });

  const users: UserSansMotDePasse[] = [admin];
  for (let i = 1; i <= NB_USERS; i++) {
    const username = genererUsername(i);
    const user = await authService.inscri({
      username,
      email: `${username}@exemple.tn`,
      password: MOT_DE_PASSE,
    });
    users.push(user);
  }
  return users;
}

async function seedSkills(skillService: SkillService): Promise<SkillEntity[]> {
  const designations = new Set<string>();
  while (designations.size < NB_SKILLS) {
    designations.add(randSkill().slice(0, 50));
  }

  const skills: SkillEntity[] = [];
  for (const designation of designations) {
    skills.push(await skillService.create({ designation }));
  }
  return skills;
}

async function seedCvs(
  cvService: CvService,
  users: UserSansMotDePasse[],
  skills: SkillEntity[],
): Promise<number> {
  let total = 0;
  for (const user of users) {
    const nbCvs = randNumber({ min: 1, max: MAX_CVS_PAR_USER });
    for (let i = 0; i < nbCvs; i++) {
      await cvService.create({
        name: randLastName().slice(0, 50),
        firstname: randFirstName().slice(0, 50),
        age: randNumber({ min: 18, max: 65 }),
        cin: String(randNumber({ min: 0, max: 99999999 })).padStart(8, '0'),
        job: randJobTitle().slice(0, 100),
        path: randFilePath(),
        skills: choisirAuHasard(skills, randNumber({ min: 1, max: 4 })),
        user: { id: user.id },
      });
      total++;
    }
  }
  return total;
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule);
  try {
    const dataSource = app.get(DataSource);
    const authService = app.get(AuthService);
    const skillService = app.get(SkillService);
    const cvService = app.get(CvService);
    const userRepository = app.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );

    await viderBase(dataSource);
    const users = await seedUsers(authService, userRepository);
    const skills = await seedSkills(skillService);
    const nbCvs = await seedCvs(cvService, users, skills);

    console.log(`Seed terminé : ${users.length} users (dont 1 admin), ${skills.length} skills, ${nbCvs} cvs.`);
    console.log(`Admin : ${ADMIN.username} / ${ADMIN.password} — Users : mot de passe ${MOT_DE_PASSE}`);
  } finally {
    await app.close();
  }
}

bootstrap();