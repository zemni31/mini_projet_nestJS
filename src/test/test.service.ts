import { Inject, Injectable } from '@nestjs/common';
import { UUID_PROVIDER } from '../common/common.constants';

@Injectable()
export class TestService {
  constructor(
    @Inject(UUID_PROVIDER) private readonly generateId: () => string,
  ) {}

  getId(): string {
    return this.generateId();
  }
}