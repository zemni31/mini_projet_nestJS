import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { ConnectedUser } from '../common/interfaces/connected-user.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cvs')
@UseGuards(JwtAuthGuard)
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @Post()
  create(@Body() dto: CreateCvDto, @CurrentUser() user: ConnectedUser) {
    return this.cvService.createCv(dto, user);
  }

  @Get()
  findAll(@CurrentUser() user: ConnectedUser) {
    return this.cvService.findAllForUser(user);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: ConnectedUser) {
    return this.cvService.findOneForUser(id, user);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCvDto,
    @CurrentUser() user: ConnectedUser,
  ) {
    return this.cvService.updateCv(id, dto, user);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: ConnectedUser) {
    return this.cvService.removeCv(id, user);
  }

  @Delete(':id/soft')
  softDelete(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: ConnectedUser) {
    return this.cvService.softDeleteCv(id, user);
  }

  @Patch(':id/restore')
  restore(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: ConnectedUser) {
    return this.cvService.restoreCv(id, user);
  }
}