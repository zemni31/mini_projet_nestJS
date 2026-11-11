import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entities/user.entity';
import { InscriptionDto } from './dto/inscription.dto';
import { AUTH_ERRORS } from './errors/auth.errors';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 10;

  constructor(
  @InjectRepository(UserEntity)
  private readonly userRepository: Repository<UserEntity>,
  private readonly jwtService: JwtService,
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

  async validateUser(
    username: string,
    password: string,
  ): Promise<Omit<UserEntity, 'password'>> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException(AUTH_ERRORS.INVALID_CREDENTIALS);
    }
    const { password: _hash, ...result } = user;
    return result;
  }
  login(user: Omit<UserEntity, 'password'>) {
    const payload = {
      userId: user.id,
      username: user.username,
      role: user.role,
    };
    return { access_token: this.jwtService.sign(payload) };
  }
}