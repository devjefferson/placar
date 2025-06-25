'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const router = useRouter();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      setError('Preencha todos os campos');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('As senhas não conferem');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      const { success, message } = await register({
        name,
        email,
        password,
        confirmPassword,
      });
      
      if (success) {
        // Redireciona para a página de login após o cadastro bem-sucedido
        router.push('/login?registered=true');
      } else {
        setError(message);
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      setError('Erro ao cadastrar usuário');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg mt-10">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-700">Cadastro</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-base font-semibold mb-2 text-gray-800">
            Nome
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white placeholder-gray-400 transition"
            placeholder="Seu nome completo"
            required
            autoComplete="name"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-base font-semibold mb-2 text-gray-800">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white placeholder-gray-400 transition"
            placeholder="seu@email.com"
            required
            autoComplete="email"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-base font-semibold mb-2 text-gray-800">
            Senha
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white placeholder-gray-400 transition"
            placeholder="••••••••"
            minLength={6}
            required
            autoComplete="new-password"
          />
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block text-base font-semibold mb-2 text-gray-800">
            Confirmar senha
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white placeholder-gray-400 transition"
            placeholder="••••••••"
            minLength={6}
            required
            autoComplete="new-password"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors text-lg disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-base text-gray-600">
          Já tem uma conta?{' '}
          <Link href="/login" className="text-blue-600 hover:underline font-semibold">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}
