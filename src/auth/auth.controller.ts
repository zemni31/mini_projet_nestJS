import { Body, Controller, Get, Post, Request, UseGuards, Version } from '@nestjs/common';
import { AuthService } from './auth.service';
import { InscriptionDto } from './dto/inscription.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginDto } from './dto/login.dto';
import { UserEntity } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('inscription')
  register(@Body() dto: InscriptionDto) {
    return this.authService.inscri(dto);
  }
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(
    @Request() req: { user: Omit<UserEntity, 'password'> },
    @Body() _dto: LoginDto,
  ) {
    return this.authService.login(req.user);
  }
  /*
  //Une route de test
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Request() req: { user: JwtPayload }) {
    return req.user;
  }*/
}