import React, { useState } from 'react';
import { Mail, Lock, User, Target, ArrowRight, Heart } from 'lucide-react';
import logo from '../assets/logo.svg';

export default function Login({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('Emagrecimento');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (!isLogin && !name)) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (isLogin) {
      // Simulação de login
      const storedUser = JSON.parse(localStorage.getItem('efe_registered_user'));
      
      if (storedUser && storedUser.email === email && storedUser.password === password) {
        onLoginSuccess({ ...storedUser, isAdmin: storedUser.email === 'nogueiralfha@gmail.com' });
      } else if (email === 'nogueiralfha@gmail.com' && password === 'missionario405') {
        const adminUser = { name: 'Administrador CSN', email, goal: 'Administração Geral', isAdmin: true };
        onLoginSuccess(adminUser);
      } else if (email === 'teste@efe.com' && password === '123456') {
        // Usuário mock padrão para facilitar testes
        const defaultUser = { name: 'Visitante Especial', email, goal: 'Saúde Geral' };
        onLoginSuccess(defaultUser);
      } else {
        setError('E-mail ou senha incorretos. (Dica: use teste@efe.com / 123456 para testar)');
      }
    } else {
      // Simulação de cadastro
      const newUser = { name, email, password, goal };
      localStorage.setItem('efe_registered_user', JSON.stringify(newUser));
      setIsLogin(true);
      setEmail(newUser.email);
      setPassword('');
      alert('Cadastro realizado com sucesso! Faça seu login para acessar o portal.');
    }
  };

  return (
    <div className="login-page flex-center fade-in">
      <div className="login-card glass">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img src={logo} alt="Saúde Natural" className="login-logo" />
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, marginTop: '12px' }}>
            Saúde <span>Natural</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
            {isLogin ? 'Entre para gerenciar seu bem-estar integral' : 'Crie sua conta de cuidado integral'}
          </p>
        </div>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!isLogin && (
            <div className="login-input-group">
              <label><User size={16} /> Nome Completo</label>
              <input
                type="text"
                placeholder="Seu nome"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="login-input-group">
            <label><Mail size={16} /> E-mail</label>
            <input
              type="email"
              placeholder="seuemail@exemplo.com"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-input-group">
            <label><Lock size={16} /> Senha</label>
            <input
              type="password"
              placeholder="Digite sua senha"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {!isLogin && (
            <div className="login-input-group">
              <label><Target size={16} /> Seu Objetivo Inicial</label>
              <select
                className="form-control"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              >
                <option value="Emagrecimento">Emagrecimento</option>
                <option value="Hipertrofia">Ganhar Massa (Hipertrofia)</option>
                <option value="Definição">Definição Muscular</option>
                <option value="Saúde Geral">Saúde Geral e Equilíbrio</option>
              </select>
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ marginTop: '8px', padding: '14px' }}>
            <span>{isLogin ? 'Entrar na Plataforma' : 'Finalizar Cadastro'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já possui uma conta? Faça Login'}
          </button>
        </div>

        {isLogin && (
          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Dica para teste rápido: <strong>teste@efe.com</strong> / Senha: <strong>123456</strong>
          </div>
        )}
      </div>
    </div>
  );
}
