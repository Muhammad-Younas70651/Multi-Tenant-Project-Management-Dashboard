
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { User } from "../types/auth";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const demoAccounts: {
  email: string;
  password: string;
  user: User;
}[] = [
  {
    email: "superadmin@example.com",
    password: "demo123",
    user: {
      id: "1",
      name: "Superadmin",
      email: "superadmin@example.com",
      role: "superadmin",
      tenantId: null,
    },
  },
  {
    email: "admin@example.com",
    password: "demo123",
    user: {
      id: "2",
      name: "Tenant Admin",
      email: "admin@example.com",
      role: "tenant-admin",
      tenantId: "tenant-1",
    },
  },
  {
    email: "member@example.com",
    password: "demo123",
    user: {
      id: "3",
      name: "Team Member",
      email: "member@example.com",
      role: "team-member",
      tenantId: "tenant-1",
    },
  },
];

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem("demo_user");

      if (!savedUser) {
        return null;
      }

      return JSON.parse(savedUser) as User;
    } catch {
      localStorage.removeItem("demo_user");
      return null;
    }
  });

  const login = async (
    email: string,
    password: string,
  ): Promise<boolean> => {
    const normalizedEmail = email.trim().toLowerCase();

    const account = demoAccounts.find(
      (item) =>
        item.email === normalizedEmail &&
        item.password === password,
    );

    if (!account) {
      return false;
    }

    try {
      localStorage.setItem("demo_user", JSON.stringify(account.user));
      setUser(account.user);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("demo_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
