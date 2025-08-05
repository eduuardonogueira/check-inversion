export const oidTable = {
  hostname: '1.3.6.1.2.1.1.5',
  eaps: '1.3.6.1.4.1.1916.1.13.2.1',
  neighbor: {
    hostname: '1.3.6.1.4.1.1916.1.13.2.1.3',
    stack: '1.3.6.1.4.1.1916.1.13.2.1.5',
    remotePort: '1.3.6.1.4.1.1916.1.13.2.1.6',
  },
  uptime: '1.3.6.1.2.1.1',
  teste: '1.3.6.1.2.1.1.3.0',
};

/*
    OID: "1.3.6.1.4.1.1916.1.13.2.1.3"
    Retorna: Nome dos vizinhos

    OID: "1.3.6.1.4.1.1916.1.13.2.1.4"
    Retorna: Systema operacional dos vizinhos

    OID: "1.3.6.1.4.1.1916.1.13.2.1.5"
    Retorna: Stack da porta remota

    OID: "1.3.6.1.4.1.1916.1.13.2.1.6"
    Retorna: Porta remota

    OID: "1.3.6.1.4.1.1916.1.13.2.1.7"
    Retorna: tempo em segundos da consulta
*/
