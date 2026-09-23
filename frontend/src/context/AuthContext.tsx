import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "../types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on load
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Demo credentials
    if (email === "demo@company.com" && password === "Demo@123") {
      const mockUser: User = {
        id: "1",
        email: email,
        name: "Demo User",
        companyName: "ABC Infrastructure Pvt. Ltd.",
        role: "user",
        createdAt: new Date().toISOString(),
      };
      
      localStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);
      return;
    }
    
    throw new Error("Invalid email or password");
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  const register = async (userData: any) => {
    // Mock registration
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: userData.email,
      name: `${userData.firstName} ${userData.lastName}`,
      companyName: userData.companyName || "Unknown Company",
      role: "user",
      createdAt: new Date().toISOString(),
    };
    
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
  };

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

