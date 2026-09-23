
import { User } from '../types';

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Demo credentials
    if (email === 'demo@company.com' && password === 'Demo@123') {
      return {
        id: '1',
        email,
        name: 'Demo User',
        companyName: 'ABC Infrastructure Pvt. Ltd.',
        role: 'user',
        createdAt: new Date().toISOString(),
      };
    }
    
    throw new Error('Invalid email or password');
  },
  
register: async (userData: any): Promise<User> => {
     await new Promise(resolve => setTimeout(resolve, 1000));
     
     const newUser: User = {
       id: Math.random().toString(36).substr(2, 9),
       email: userData.email,
       name: userData.firstName,
       companyName: userData.companyName || 'Unknown Company',
       role: 'user',
       createdAt: new Date().toISOString(),
     };
     
     return newUser;
   },
  
  logout: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return;
  },
  
  getCurrentUser: async (): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }
};

