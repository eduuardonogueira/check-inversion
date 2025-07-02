import { Module } from '@nestjs/common';
import { NeighborsController } from './neighbors.controller';
import { NeighborsService } from './neighbors.service';

@Module({
  controllers: [NeighborsController],
  providers: [NeighborsService],
})
export class NeighborsModule {}
