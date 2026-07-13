export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role: string;
  photoURL?: string;
  bio?: string;
  skills?: string[];
  portfolio?: Array<{
    title: string;
    image: string;
    description: string;
    tags?: string[];
  }>;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, photoURL?: string, role?: string) => Promise<void>;
  googleLogin: (token: string) => Promise<void>;
  updateUser: (data: Partial<User>) => void;
  logout: () => void;
}
