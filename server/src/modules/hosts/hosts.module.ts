import { Module } from '@nestjs/common';
import { HostsController } from './hosts.controller';
import { HostsService } from './hosts.service';
import { PrismaService } from '../prisma/prisma.service';
import { SnmpService } from '../snmp/snmp.service';
import { SnmpRepository } from '../snmp/snmp.repository';
import { SnmpMethods } from '../snmp/snmp.methods';

@Module({
  controllers: [HostsController],
  providers: [
    HostsService,
    PrismaService,
    SnmpService,
    SnmpRepository,
    SnmpMethods,
  ],
})
export class HostsModule {}
