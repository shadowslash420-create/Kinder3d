import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth, onAuthStateChanged, getUserRole, logOut, handleRedirectResult, type User, type UserRole } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  loading: boolean;
  isAdmin: boolean;
  isStaffA: boolean;
  isStaffB: boolean;
  isStaff: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handle redirect result first
    handleRedirectResult();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const userRole = await getUserRole(firebaseUser);
        setRole(userRole);
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await logOut();
    setUser(null);
    setRole(null);
  };

  const isAdmin = role === "admin";
  const isStaffA = role === "staff_a";
  const isStaffB = role === "staff_b";
  const isStaff = isStaffA || isStaffB;

  return (
    <AuthContext.Provider value={{ user, role, loading, isAdmin, isStaffA, isStaffB, isStaff, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
