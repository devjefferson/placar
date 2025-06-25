import { AuthUser, LoginData, RegisterData, User } from "@/types/user";

// Chaves para o localStorage
const USERS_KEY = 'placar_users';
const AUTH_KEY = 'placar_auth';

// Função para gerar um ID único
const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Função para obter todos os usuários
const getUsers = (): User[] => {
  if (typeof window === 'undefined') return [];
  
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

// Função para salvar os usuários
const saveUsers = (users: User[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
};

// Função para registrar um novo usuário
export const registerUser = (data: RegisterData): { success: boolean; message: string } => {
  try {
    const users = getUsers();
    
    // Verificar se o email já está cadastrado
    if (users.some(user => user.email === data.email)) {
      return { success: false, message: 'Email já cadastrado' };
    }
    
    // Verificar se as senhas conferem
    if (data.password !== data.confirmPassword) {
      return { success: false, message: 'As senhas não conferem' };
    }
    
    // Criar um novo usuário
    const newUser: User = {
      id: generateId(),
      name: data.name,
      email: data.email,
      password: data.password, // Em um sistema real, deveria criptografar a senha
    };
    
    // Adicionar o novo usuário e salvar
    users.push(newUser);
    saveUsers(users);
    
    return { success: true, message: 'Cadastro realizado com sucesso' };
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    return { success: false, message: 'Erro ao cadastrar usuário' };
  }
};

// Função para fazer login
export const loginUser = (data: LoginData): { success: boolean; message: string; user?: AuthUser } => {
  try {
    const users = getUsers();
    
    // Encontrar o usuário pelo email e verificar a senha
    const user = users.find(user => user.email === data.email && user.password === data.password);
    
    if (!user) {
      return { success: false, message: 'Email ou senha inválidos' };
    }
    
    // Criar o usuário autenticado (sem a senha)
    const authUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    
    // Salvar no localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
    }
    
    return { success: true, message: 'Login realizado com sucesso', user: authUser };
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return { success: false, message: 'Erro ao fazer login' };
  }
};

// Função para obter o usuário logado
export const getAuthUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null;
  
  const auth = localStorage.getItem(AUTH_KEY);
  return auth ? JSON.parse(auth) : null;
};

// Função para fazer logout
export const logoutUser = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_KEY);
  }
};
