import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHostDto } from './dtos/create-host.dto';
import { UpdateHostDto } from './dtos/update-host.dto';

@Injectable()
export class HostsService {
  constructor(private prisma: PrismaService) {}

  async getAll(currentPage: number, pageSize: number) {
    const hosts = await this.prisma.host.findMany({
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
      include: { neighbors: true },
    });

    if (!hosts) {
      throw new NotFoundException('Products not found');
    }

    const total = await this.prisma.host.count();
    const pageQty = Math.ceil(total / pageSize);

    return {
      data: hosts,
      pagination: { currentPage, pageSize, pageQty, total },
    };
  }

  async findOne(
    id?: string,
    hostname?: string,
    ip?: string,
    neighbors?: boolean,
  ) {
    const host = await this.prisma.host.findUnique({
      where: { id, ip, hostname },
      include: { neighbors },
    });

    if (!host) {
      throw new NotFoundException('Host not found');
    }

    return host;
  }

  async getMany(page: number, pageSize: number, neighbors?: boolean) {
    const hosts = await this.prisma.host.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { neighbors },
    });

    if (!hosts) {
      throw new NotFoundException('Hosts not found');
    }

    const total = await this.prisma.host.count();
    const pageQty = Math.ceil(total / pageSize);

    return { hosts, pagination: { pageQty, total } };
  }

  async create(host: CreateHostDto) {
    const createHost = await this.prisma.host.create({
      data: {
        ...host,
        neighbors: host.neighbors
          ? {
              create: host.neighbors.map((neighbor) => ({
                hostname: neighbor.hostname,
                port: neighbor.port,
                remotePort: neighbor.remotePort,
              })),
            }
          : {},
      },
      include: { neighbors: true },
    });

    return createHost;
  }

  async createMany(hostArray: CreateHostDto[]) {
    const createManyHosts = await this.prisma.host.createMany({
      data: hostArray,
      skipDuplicates: true,
    });

    return createManyHosts;
  }

  async update(id: string, host: UpdateHostDto) {
    const neighbors = host.neighbors.length !== 0 ? true : false;
    const findedHost = await this.findOne(id, undefined, undefined, neighbors);

    const updatedHost = this.prisma.host.update({
      where: { id: findedHost.id },
      data: {
        hostname: host.hostname,
        ip: host.ip,
        neighbors: {
          updateMany: {
            where: { hostId: findedHost.id },
            data: host.neighbors.map((neighbor) => neighbor),
          },
        },
      },
      include: { neighbors: true },
    });

    return updatedHost;
  }

  async delete(id: string) {
    const host = await this.findOne(id);

    return this.prisma.host.delete({
      where: { id: host.id },
      include: { neighbors: true },
    });
  }
}
