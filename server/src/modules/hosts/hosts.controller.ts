import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { HostsService } from './hosts.service';
import { CreateHostDto } from './dtos/create-host.dto';
import { UpdateHostDto } from './dtos/update-host.dto';
import { HostsPaginationDto } from './dtos/hosts-pagination.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { SnmpService } from '../snmp/snmp.service';

@UseGuards(JwtGuard)
@Controller('hosts')
export class HostsController {
  constructor(
    private hostsService: HostsService,
    private snmpService: SnmpService,
  ) {}

  @Get()
  async getAllHosts(
    @Query()
    hostsPaginationDto: HostsPaginationDto,
  ) {
    const { currentPage, pageSize } = hostsPaginationDto;
    return await this.hostsService.getAll(currentPage, pageSize);
  }

  @Post('/create')
  async createHost(@Body() hostPayload: CreateHostDto) {
    return await this.hostsService.create(hostPayload);
  }

  @Post('/create/auto')
  async createHostAutomatically(@Body() body: { ip: string }) {
    const hostData = await this.snmpService.getLldp(body.ip);
    const createdHost = await this.hostsService.create(hostData);
    return createdHost;
  }

  @Get('/:id')
  async getHost(@Param('id') id: string) {
    return await this.hostsService.findOne(id);
  }

  @Patch('/:id')
  async updateHost(@Param('id') id: string, @Body() data: UpdateHostDto) {
    return await this.hostsService.update(id, data);
  }

  @Delete('/:id')
  async removeHost(@Param('id') id: string) {
    return await this.hostsService.delete(id);
  }
}
