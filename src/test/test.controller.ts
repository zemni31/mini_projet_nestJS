import { Controller, Get } from '@nestjs/common';
import { TestService } from './test.service';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {} //Le paramètre testService reçoit une instance de TestService

  @Get()
  getId() {
    return { id: this.testService.getId() };
  }
}