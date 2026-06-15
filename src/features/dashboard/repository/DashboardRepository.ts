export class DashboardRepository {
  static async getSummary(): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: { name: 'Administrador' },
          gateways: { total: 12, online: 11, offline: 1, faulty: 0 },
          devices: { total: 148, active: 142, inactive: 6 },
          analytics: [80, 60, 90, 75, 85],
          recentGateways: [
            { id: 'GTW-BOG-001', location: 'Bogotá - Sede Norte', status: 'Activo' },
            { id: 'GTW-MED-042', location: 'Medellín - Planta 2', status: 'Offline' }
          ],
          recentDevices: [
            { id: 'SNSR-HUM-99', uid: '45:A2:88:FE:21', status: 'Activo' },
            { id: 'TEMP-CTRL-05', uid: '12:C5:99:AA:08', status: 'Activo' }
          ]
        });
      }, 500);
    });
  }
}
