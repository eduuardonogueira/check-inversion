import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { HostsModule } from './modules/hosts/hosts.module';
import { NeighborsModule } from './modules/neighbors/neighbors.module';
import { QueryLogsModule } from './modules/query-logs/query-logs.module';
import { PrismaService } from './modules/prisma/prisma.service';
import { SnmpModule } from './modules/snmp/snmp.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.development',
      load: [configuration],
      isGlobal: true,
    }),
    SnmpModule,
    HostsModule,
    NeighborsModule,
    QueryLogsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
