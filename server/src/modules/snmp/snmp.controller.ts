import { Controller, Get, Param, Query } from '@nestjs/common';
import { SnmpService } from './snmp.service';
import { CustomRequestDto } from './dtos/custom-request.dto';

@Controller('snmp')
export class SnmpController {
  constructor(private readonly snmpService: SnmpService) {}

  @Get('/lldp/:ip')
  async lldpRequest(@Param('ip') ip: string) {
    return await this.snmpService.getLldp(ip);
  }

  @Get('/uptime/:ip')
  async uptimeRequest(@Param('ip') ip: string) {
    return await this.snmpService.getUptime(ip);
  }

  @Get('/test/:ip')
  async testRequest(@Param('ip') ip: string) {
    return await this.snmpService.testSnmpOID(ip);
  }

  @Get('/custom')
  async customRequest(@Query() querys: CustomRequestDto) {
    return await this.snmpService.snmpCustom(querys);
  }
}
