'use client';

import { LoginForm } from '@/components/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Redireciona para o dashboard se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);
  
  // Verifica se veio da página de registro
  const registered = searchParams.get('registered');
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
        {registered && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 mb-4">
            Cadastro realizado com sucesso! Faça login para continuar.
          </div>
        )}
        
        <LoginForm />
      </div>
    </div>
  );
}
