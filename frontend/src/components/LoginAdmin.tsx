import React, { useState } from 'react';
import { LogIn, Eye, EyeOff, Loader2 } from 'lucide-react';

interface LoginAdminProps {
  onLoginSuccess: () => void;
}

export default function LoginAdmin({ onLoginSuccess }: LoginAdminProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('🔐 Tentando fazer login...', { email });
      
      // Login de demonstração temporário (sem backend)
      if (email === 'admin@demo.com' && password === 'demo123') {
        console.log('✅ Login de demonstração aceito');
        const mockData = {
          token: 'demo-token-' + Date.now(),
          user: { id: '1', name: 'Admin Demo', email: 'admin@demo.com', role: 'OWNER' }
        };
        
        localStorage.setItem('adminToken', mockData.token);
        localStorage.setItem('adminUser', JSON.stringify(mockData.user));
        
        console.log('💾 Dados salvos no localStorage');
        console.log('🚀 Chamando onLoginSuccess...');
        onLoginSuccess();
        return;
      }
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('📡 Resposta recebida:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Erro na resposta:', errorData);
        throw new Error(errorData.message || 'Credenciais inválidas');
      }

      const data = await response.json();
      console.log('✅ Login bem-sucedido:', data);
      
      // Salvar token no localStorage
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.user));
      
      console.log('💾 Dados salvos no localStorage');
      console.log('🚀 Chamando onLoginSuccess...');
      onLoginSuccess();
    } catch (err) {
      console.error('❌ Erro no login:', err);
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 via-orange-500 to-orange-400 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Painel Admin</h1>
          <p className="text-gray-600">Entre com suas credenciais</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2" style={{ color: '#111827' }}>
              E-mail
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2" style={{ color: '#111827' }}>
              Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition pr-12"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Entrando...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Entrar
              </>
            )}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-semibold text-blue-900 mb-2">🔑 Credenciais de Demonstração:</p>
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>E-mail:</strong> admin@demo.com</p>
            <p><strong>Senha:</strong> demo123</p>
          </div>
          <p className="text-xs text-blue-600 mt-2">
            ℹ️ Use estas credenciais para acessar o painel sem banco de dados configurado.
          </p>
        </div>

        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Esqueceu sua senha?</p>
          <button className="text-orange-600 hover:text-orange-700 font-medium mt-1">
            Recuperar acesso
          </button>
        </div>
      </div>
    </div>
  );
}
