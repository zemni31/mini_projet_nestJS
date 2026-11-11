import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entities/user.entity';
import { InscriptionDto } from './dto/inscription.dto';
import { AUTH_ERRORS } from './errors/auth.errors';

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 10;

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // Inscription 
  async inscri(dto: InscriptionDto): Promise<Omit<UserEntity, 'password'>> {
    const exists = await this.userRepository.findOne({
      where: [{ username: dto.username }, { email: dto.email }],
    });
    if (exists) {
      throw new ConflictException(AUTH_ERRORS.USER_ALREADY_EXISTS);
    }

    const hashed = await bcrypt.hash(dto.password, this.SALT_ROUNDS);
    const user = this.userRepository.create({ ...dto, password: hashed });
    const saved = await this.userRepository.save(user);

    const { password, ...result } = saved;
    return result;
  }

  
}