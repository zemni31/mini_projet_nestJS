import { Body, Controller, Post, Version } from '@nestjs/common';
import { AuthService } from './auth.service';
import { InscriptionDto } from './dto/inscription.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('inscription')
  register(@Body() dto: InscriptionDto) {
    return this.authService.inscri(dto);
  }
}