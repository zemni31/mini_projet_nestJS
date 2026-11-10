import { Module,Global } from '@nestjs/common';
import { uuidProvider } from './common.service';
import { UUID_PROVIDER } from './common.constants';
@Global()
@Module({
  providers: [uuidProvider],
  exports: [UUID_PROVIDER],
})
export class CommonModule {}