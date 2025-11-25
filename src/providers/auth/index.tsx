import { createContext, FC, PropsWithChildren, useCallback, useContext, useEffect, useRef, useState } from "react";

import { api } from "@services";
import { useStore } from "@store";

interface IAuthContextType {
  auth: boolean;
  setAuth: (auth: boolean) => void;
}

const AuthContext = createContext<IAuthContextType | undefined>(undefined);

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [auth, setAuth] = useState<boolean>(!!localStorage.getItem("accessToken"));
  const setStateAuth = useStore((s) => s.setAuth);
  const canFetch = useRef(true);

  const getCurrentUser = useCallback(async () => {
    try {
      setStateAuth({ isLoading: true, check: false, user: null });

      const token = localStorage.getItem("accessToken");

      if (token) {
        const { data } = await api.get("/users/me");
        setStateAuth({ isLoading: false, check: true, user: data });
      }
    } catch (err) {
      console.error("Error", err);
    }
  }, [setStateAuth]);

  useEffect(() => {
    if (canFetch.current) {
      canFetch.current = false;
      getCurrentUser();
    }
  }, [getCurrentUser]);

  return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }

  return context;
};
