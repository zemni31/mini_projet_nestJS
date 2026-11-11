import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards, // ← NOUVEAU
} from '@nestjs/common';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator'; // ← NOUVEAU
import type { ConnectedUser } from '../common/interfaces/connected-user.interface'; // ← NOUVEAU
import { FakeAuthGuard } from '../common/guards/fake-auth.guard'; // ← NOUVEAU (TEMPORAIRE → JwtAuthGuard du lot 4)

@Controller('cvs')
export class CvController {
  constructor(private readonly cvService: CvService) { }

  @Post()
  @UseGuards(FakeAuthGuard)
  create(@Body() dto: CreateCvDto, @CurrentUser() user: ConnectedUser) {
    return this.cvService.createCv(dto, user);
  }

  @Get()
  findAll() {
    return this.cvService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cvService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(FakeAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCvDto,
    @CurrentUser() user: ConnectedUser,
  ) {
    return this.cvService.updateCv(id, dto, user);
  }

  @Delete(':id')
  @UseGuards(FakeAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: ConnectedUser) {
    return this.cvService.removeCv(id, user);
  }

  @Delete(':id/soft')
  @UseGuards(FakeAuthGuard)
  softDelete(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: ConnectedUser) {
    return this.cvService.softDeleteCv(id, user);
  }

  @Patch(':id/restore')
  @UseGuards(FakeAuthGuard)
  restore(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: ConnectedUser) {
    return this.cvService.restoreCv(id, user);
  }
}