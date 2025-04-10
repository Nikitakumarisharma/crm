
import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "sales" | "cto" | "developer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  createDeveloper: (name: string, email: string, password: string) => Promise<void>;
  getAllDevelopers: () => User[];
  getDeveloperById: (id: string) => User | null;
}

// Mock users for demonstration
const INITIAL_USERS: User[] = [
  { id: "1", name: "Sales User", email: "sales@cmtai.com", role: "sales" },
  { id: "2", name: "CTO", email: "cto@cmtai.com", role: "cto" },
  { id: "3", name: "Developer 1", email: "dev1@cmtai.com", role: "developer" },
  { id: "4", name: "Developer 2", email: "dev2@cmtai.com", role: "developer" },
];

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem("cmtai_user");
    const savedUsers = localStorage.getItem("cmtai_users");
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      setUsers(INITIAL_USERS);
      localStorage.setItem("cmtai_users", JSON.stringify(INITIAL_USERS));
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // For demo purposes, we'll just match the email
    const foundUser = users.find((u) => u.email === email);
    
    if (!foundUser) {
      setLoading(false);
      throw new Error("Invalid credentials");
    }
    
    // Store user in localStorage
    localStorage.setItem("cmtai_user", JSON.stringify(foundUser));
    setUser(foundUser);
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("cmtai_user");
    setUser(null);
  };
  
  const createDeveloper = async (name: string, email: string, password: string) => {
    // Check if email already exists
    if (users.some(u => u.email === email)) {
      throw new Error("A user with this email already exists");
    }
    
    // Create new developer
    const newDeveloper: User = {
      id: Date.now().toString(),
      name,
      email,
      role: "developer"
    };
    
    const updatedUsers = [...users, newDeveloper];
    setUsers(updatedUsers);
    
    // Save to localStorage
    localStorage.setItem("cmtai_users", JSON.stringify(updatedUsers));
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return;
  };
  
  const getAllDevelopers = () => {
    return users.filter(u => u.role === "developer");
  };
  
  const getDeveloperById = (id: string) => {
    return users.find(u => u.id === id && u.role === "developer") || null;
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      isAuthenticated: !!user,
      createDeveloper,
      getAllDevelopers,
      getDeveloperById
    }}>
      {children}
    </AuthContext.Provider>
  );
};
