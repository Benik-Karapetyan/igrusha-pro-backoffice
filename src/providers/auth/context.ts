import { createContext } from "react";

export interface IAuthContextType {
  auth: boolean;
  setAuth: (auth: boolean) => void;
}

export const AuthContext = createContext<IAuthContextType | undefined>(undefined);
