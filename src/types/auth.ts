export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role: string;
  photoURL?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, photoURL?: string) => Promise<void>;
  logout: () => void;
}
