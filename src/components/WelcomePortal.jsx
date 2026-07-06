import React from 'react';
import { BookOpen, Dumbbell, Heart, ArrowRight } from 'lucide-react';

export default function WelcomePortal({ user, onStart }) {
  return (
    <div className="portal-page flex-center fade-in">
      <div className="portal-container glass">
        
        {/* Top Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ 
            padding: '6px 16px', 
            background: 'var(--primary-light)', 
            color: 'var(--primary)', 
            fontSize: '0.8rem', 
            fontWeight: 800, 
            borderRadius: '50px', 
            textTransform: 'uppercase',
            letterSpacing: '1px' 
          }}>
            Bem-vindo ao Cuidado Integral
          </span>
          <h1 style={{ 
            fontFamily: 'var(--font-display)', 
            fontWeight: 800, 
            fontSize: '2.5rem', 
            marginTop: '16px',
            color: 'var(--text-primary)'
          }}>
            Olá, {user?.name || 'Guerreiro(a)'}!
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '8px auto 0', fontSize: '0.95rem', lineHeight: '1.6' }}>
            Seu perfil foi configurado para o objetivo de <strong>{user?.goal || 'Saúde Geral'}</strong>. O portal de Saúde Natural cuida de você por completo.
          </p>
        </div>

        {/* Três Esferas de Cuidado */}
        <div className="grid-3" style={{ gap: '20px', marginBottom: '40px' }}>
          
          {/* Esfera 1: Espiritual */}
          <div className="portal-sphere glass glass-hover" style={{ borderColor: 'rgba(139, 92, 246, 0.2)' }}>
            <div className="sphere-icon flex-center" style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'var(--primary)' }}>
              <BookOpen size={24} />
            </div>
            <h3>Espiritual</h3>
            <p>Alimente a sua alma diariamente com porções bíblicas, leituras devocionais e orações focadas em dar direção e firmeza à sua caminhada.</p>
          </div>

          {/* Esfera 2: Físico */}
          <div className="portal-sphere glass glass-hover" style={{ borderColor: 'rgba(6, 182, 212, 0.2)' }}>
            <div className="sphere-icon flex-center" style={{ background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-blue)' }}>
              <Dumbbell size={24} />
            </div>
            <h3>Físico</h3>
            <p>Monitore seu corpo com calculadora de IMC/TMB, hidratação, contador de passos e mais de 240 receitas saudáveis e rotinas de treinos.</p>
          </div>

          {/* Esfera 3: Emocional */}
          <div className="portal-sphere glass glass-hover" style={{ borderColor: 'rgba(249, 115, 22, 0.2)' }}>
            <div className="sphere-icon flex-center" style={{ background: 'rgba(249, 115, 22, 0.1)', color: 'var(--accent-orange)' }}>
              <Heart size={24} />
            </div>
            <h3>Emocional</h3>
            <p>Gerencie sua ansiedade e mantenha hábitos saudáveis programando lembretes de autocuidado e mantendo um ritmo equilibrado de vida.</p>
          </div>

        </div>

        {/* Botão de Entrada */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button 
            onClick={onStart} 
            className="btn btn-primary pulse-btn" 
            style={{ padding: '16px 36px', borderRadius: '50px', fontSize: '1.05rem', gap: '12px' }}
          >
            <span>Acessar Painel Saúde Natural</span>
            <ArrowRight size={20} />
          </button>
        </div>

      </div>
    </div>
  );
}
