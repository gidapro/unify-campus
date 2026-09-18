import React, { createContext, useContext, useState } from "react";
import { UserProfile } from "@/types";
import { USERS, CURRENT_USER_ID } from "@/data/mockData";

interface AuthContextValue {
  user: UserProfile;
  isOnboarded: boolean;
  completeOnboarding: (passionIds: string[]) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// En mode demo l'utilisateur courant est deja authentifie (Giovanni).
// En production: brancher firebase/auth (onAuthStateChanged) ici.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>(
    () => USERS.find((u) => u.id === CURRENT_USER_ID)!
  );
  const [isOnboarded, setIsOnboarded] = useState(user.passionIds.length > 0);

  const completeOnboarding = (passionIds: string[]) => {
    setUser((prev) => ({ ...prev, passionIds }));
    setIsOnboarded(true);
  };

  return (
    <AuthContext.Provider value={{ user, isOnboarded, completeOnboarding }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit etre utilise dans AuthProvider");
  return ctx;
}
