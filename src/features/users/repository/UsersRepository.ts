export class UsersRepository {
  static async getUsers(): Promise<any[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: '1', name: 'Oldrin Pruebaquince', role: 'Administrador', email: 'oldrin.prueba@hasgreen.com', phone: '+52 555 123 4567' },
          { id: '2', name: 'user update uno dos', role: 'Operador', email: 'update.uno@hasgreen.io', phone: '+52 555 987 6543' },
          { id: '3', name: 'Madelein Pérez', role: 'Soporte Técnico', email: 'm.perez@hasgreen.com', phone: '+52 555 333 4444' },
        ]);
      }, 500);
    });
  }

  static async getUserById(id: string): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ id, name: 'Oldrin Pruebaquince', role: 'Administrador', email: 'oldrin@hasgreen.com' }), 300);
    });
  }

  static async createUser(data: any): Promise<{ success: boolean }> {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 600);
    });
  }

  static async updateUser(id: string, data: any): Promise<{ success: boolean }> {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 600);
    });
  }

  static async deleteUser(id: string): Promise<{ success: boolean }> {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 400);
    });
  }
}
