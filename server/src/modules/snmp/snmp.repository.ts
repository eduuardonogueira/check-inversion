import { HttpException, Injectable } from '@nestjs/common';
import { oidTable } from './helpers/oidTable';
import { Varbinds } from './helpers/types';
import { SnmpMethods } from './snmp.methods';
import configuration from 'src/config/configuration';

export interface Gbic {
  id: number;
  port?: number;
  description?: string;
  sensor: {
    id: number;
    type?: number;
    scale?: number;
    precision?: number;
    value?: number;
    status?: number;
    unitsDisplay?: string;
    valueTimeStamp?: number;
    valueUpdateRate?: number;
    description?: string;
  }[];
}

@Injectable()
export class SnmpRepository {
  constructor(private snmpMethods: SnmpMethods) {}

  filterByOid(varbinds: Varbinds[], oid: string) {
    return varbinds
      .filter((varbind) => varbind.oid.startsWith(oid))
      .map((varbind) => varbind.value);
  }

  getLastOidNumber(varbinds: Varbinds[]) {
    return varbinds
      .map((varbind) => {
        const lastNumber = varbind.oid.split('.').pop();
        if (lastNumber.length === 3) return lastNumber;
      })
      .filter((item) => item);
  }

  findByIndex(varbinds: Varbinds[], index: string) {
    return varbinds.find((valuesOid) => valuesOid.oid.includes(index)).value;
  }

  async getHostname(ip: string): Promise<string> {
    try {
      const community = configuration().community;
      const consult = await this.snmpMethods.subtree(
        ip,
        community,
        oidTable.hostname,
      );

      const hostname = consult[0].value.toString();
      return hostname;
    } catch (error) {
      console.error('Error getting hostname: ', error);
      throw new HttpException(error || 'Internal server error', 500);
    }
  }

  async getNeighbor(ip: string): Promise<
    {
      hostname: string;
      port: string;
      remotePort: string;
    }[]
  > {
    try {
      const community = configuration().community;
      const result = await this.snmpMethods.subtree(
        ip,
        community,
        oidTable.eaps,
      );

      const neighbors = this.filterByOid(result, oidTable.neighbor.hostname);
      const stacks = this.filterByOid(result, oidTable.neighbor.stack);
      const remotePorts = this.filterByOid(
        result,
        oidTable.neighbor.remotePort,
      );
      const ports = neighbors.map(
        (_, index) => result[index].oid[30] + result[index].oid[31],
      );

      const data = neighbors.map((_, index) => ({
        hostname: neighbors[index].toString(),
        port: ports[index],
        remotePort: `${stacks[index]}:${remotePorts[index]}`,
      }));

      return data;
    } catch (error) {
      console.error('Error getting neighbors: ', error);
      throw new HttpException(error || 'Internal server error', 500);
    }
  }

  async getUptime(ip: string): Promise<any> {
    try {
      const community = configuration().community;
      const result = await this.snmpMethods.subtree(
        ip,
        community,
        oidTable.uptime,
      );

      const [timeticks] = this.filterByOid(result, '1.3.6.1.2.1.1.3.0');

      console.log(timeticks);

      if (typeof timeticks === 'number') {
        const milliseconds = timeticks * 10;

        const now = Date.now();
        const date = new Date(now - milliseconds);

        return {
          uptime: date,
        };
      }
    } catch (error) {
      console.error('Error getting uptime: ', error);
      throw new HttpException(error || 'Internal server error', 500);
    }
  }

  async getTransceivers(ip: string) {
    const gbicArray: Gbic[] = [];
    const itemsIndex: Gbic['sensor'] = [];

    const indexMapping = await this.snmpMethods.subtree(
      ip,
      'v1a1pe@RNPcom91',
      '1.3.6.1.2.1.47.1.1.1.1.4',
      true,
    );

    const valuesMapping = await this.snmpMethods.subtree(
      ip,
      'v1a1pe@RNPcom91',
      '1.3.6.1.2.1.99.1.1.1',
    );

    console.log(valuesMapping);

    indexMapping.forEach((varbind: Varbinds, index: number) => {
      if (typeof varbind.value === 'number') {
        if (varbind.value - 3 < 1 || varbind.value.toString().length > 2)
          return;
        const portIndex = varbind.value;
        const lastOidNumber = parseInt(varbind.oid.split('.').pop());
        itemsIndex.push({ id: lastOidNumber });

        if (varbind.value !== indexMapping[index + 1].value) {
          gbicArray.push({
            id: portIndex,
            port: portIndex - 3,
            sensor: [...itemsIndex],
          });
          itemsIndex.length = 0;
        }
      }
    });

    const descriptionMapping = await this.snmpMethods.subtree(
      ip,
      'v1a1pe@RNPcom91',
      '1.3.6.1.2.1.47.1.1.1.1.2',
    );

    const filtered = gbicArray.map((port) => ({
      ...port,
      description: descriptionMapping.find(
        (descriptionOid) =>
          descriptionOid.oid.split('.').pop() === port.id.toString(),
      ).value,

      sensor: port.sensor.map((item) => ({
        ...item,
        description: descriptionMapping.find(
          (descriptionOid) =>
            descriptionOid.oid.split('.').pop() === item.id.toString(),
        ).value,
        type: this.findByIndex(valuesMapping, `1.${item.id}`),
        scale: this.findByIndex(valuesMapping, `2.${item.id}`),
        precision: this.findByIndex(valuesMapping, `3.${item.id}`),
        value: this.findByIndex(valuesMapping, `4.${item.id}`),
        status: this.findByIndex(valuesMapping, `5.${item.id}`),
        unitsDisplay: this.findByIndex(valuesMapping, `6.${item.id}`),
        valueTimeStamp: this.findByIndex(valuesMapping, `7.${item.id}`),
        valueUpdateRate: this.findByIndex(valuesMapping, `8.${item.id}`),
      })),
    }));

    return filtered;

    // 1.3.6.1.2.1.2.2.1.2 -
    // 1.3.6.1.2.1.47.1.1.1.1.4 - indice dos items
    // 1.3.6.1.2.1.2.2.1.2 mapeamento das portas
    // 1.3.6.1.2.1.47.1.3.2.1.2 indices das portas
    // 1.3.6.1.2.1.47.1.1.1.1 mapeamento das descrições
    // 1.3.6.1.2.1.99.1.1.1.4 mapeamento dos valores das portas
    // 1.3.6.1.2.1.47.1.1.1.1.2. + indice da porta - Velocidade do Gbic - 10 Gbps Ethernet Port
    // 1.3.6.1.2.1.47.1.1.1.1.2. + indice do items - Nome do item - SFP TX Bias Current Sensor
    // 1.3.6.1.2.1.47.1.1.1.1.6 - numero da porta
    // 1.3.6.1.2.1.47.1.1.1.1.11 - SK1BE5137926
    // 1.3.6.1.2.1.47.1.1.1.1.12 - marca gbic
    // 1.3.6.1.2.1.47.1.1.1.1.13 - modelo gbic
    //
  }

  async customConsult(ip: string, community: string, oid: string) {
    try {
      const result = await this.snmpMethods.subtree(ip, community, oid);
      console.log('oioio');
      console.log(result);
      return result;
    } catch (error) {
      console.error('Error in custom consultation: ', error);
      throw new HttpException(error || 'Internal server error', 500);
    }
  }
}
