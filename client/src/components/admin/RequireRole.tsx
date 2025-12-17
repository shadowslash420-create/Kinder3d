import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { auth, onAuthStateChanged, getUserRole, type UserRole } from "@/lib/firebase";

interface RequireRoleProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

export default function RequireRole({ children, allowedRoles, redirectTo = "/admin" }: RequireRoleProps) {
  const [, setLocation] = useLocation();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLocation(redirectTo);
        return;
      }

      const role = await getUserRole(user);
      if (allowedRoles.includes(role)) {
        setAuthorized(true);
      } else {
        setLocation(redirectTo);
      }
    });

    return () => unsubscribe();
  }, [allowedRoles, redirectTo, setLocation]);

  if (authorized === null) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
}
