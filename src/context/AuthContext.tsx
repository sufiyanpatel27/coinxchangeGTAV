import { createContext, useState, ReactNode } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

interface AuthContextType {
  token: string | null;
  email: string | null;
  userId: string | null;
  signUp: (email: string, name: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {

  const base_url = import.meta.env.VITE_BASE_URL || "http://localhost:5500/";

  const [token, setToken] = useState<string | null>(localStorage.getItem('CoinXchangetokenGTAV'));
  const [email, setEmail] = useState<string | null>(localStorage.getItem('CoinXchangeemailGTAV'));
  const [userId, setUserId] = useState<string | null>(localStorage.getItem('CoinXchangeuserIdGTAV'));

  const handleAuth = (token: string) => {
    setToken(token);
    localStorage.setItem('CoinXchangetokenGTAV', token);
    const decodedToken: any = jwtDecode(token);
    setEmail(decodedToken.email);
    setUserId(decodedToken.userId);
    localStorage.setItem('CoinXchangeemailGTAV', decodedToken.email);
    localStorage.setItem('CoinXchangeuserIdGTAV', decodedToken.userId);
  };

  const signUp = async (email: string, name: string, password: string) => {
    await axios.post(base_url + 'signup', { email, name, password });
    // handleAuth(response.data.token);
  };

  const signIn = async (email: string, password: string) => {
    const response = await axios.post(base_url + 'signin', { email, password });
    handleAuth(response.data.token);
  };

  const signOut = () => {
    setToken(null);
    setEmail(null);
    localStorage.removeItem('CoinXchangetokenGTAV');
    localStorage.removeItem('CoinXchangeemailGTAV');
  };

  return (
    <AuthContext.Provider value={{ token, email, userId, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
