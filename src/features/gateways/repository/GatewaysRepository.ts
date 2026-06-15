export class GatewaysRepository {
  static async getGateways(): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 500);
    });
  }

  static async getGatewayById(id: string): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, id });
      }, 500);
    });
  }

  static async createGateway(data: any): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
  }

  static async updateGateway(id: string, data: any): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
  }

  static async deleteGateway(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
  }
}
