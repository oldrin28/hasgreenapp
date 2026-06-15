export class ProfileRepository {
  static async getProfile(): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '1',
          name: 'Oldrin Pruebaquince',
          initials: 'OP',
          status: 'Inactive',
          notifications: { sms: 4, voice: 2, email: 4, push: 10, whatsapp: 4 },
        });
      }, 400);
    });
  }

  static async updateProfile(data: any): Promise<{ success: boolean }> {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 600);
    });
  }

  static async changePassword(current: string, newPassword: string): Promise<{ success: boolean }> {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 700);
    });
  }

  static async logout(): Promise<{ success: boolean }> {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 300);
    });
  }
}
