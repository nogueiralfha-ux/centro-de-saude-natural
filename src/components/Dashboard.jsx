import React, { useState, useEffect } from 'react';
import { Droplet, Trophy, Target, Award, Footprints, CheckCircle2, ChevronRight, AlertTriangle } from 'lucide-react';
import { challenges as defaultChallenges } from '../data/challenges';

export default function Dashboard({ setActiveTab }) {
  const [challenges, setChallenges] = useState({ leve: [], moderado: [], pesado: [] });

  // Estado da água
  const [waterCups, setWaterCups] = useState(0);
  const waterGoal = 10; // 10 copos de 250ml = 2.5L

  // Desafio de 30 dias
  const [challengeLevel, setChallengeLevel] = useState('leve'); // 'leve', 'moderado', 'pesado'
  const [challengeProgress, setChallengeProgress] = useState(5); // Dia atual do desafio
  const [checkedDays, setCheckedDays] = useState([]); // Dias já concluídos do nível atual
  const [selectedDay, setSelectedDay] = useState(5); // Dia selecionado para exibição

  // Conquistas
  const [score, setScore] = useState(150);

  // Contador de passos
  const [steps, setSteps] = useState(4230);
  const stepsGoal = 8000;

  // Carregar dados salvos
  useEffect(() => {
    // Carregar desafios customizados
    const customChallenges = JSON.parse(localStorage.getItem('efe_custom_challenges'));
    if (customChallenges) {
      setChallenges(customChallenges);
    } else {
      setChallenges(defaultChallenges);
    }

    const savedWater = localStorage.getItem('efe_water_today');
    if (savedWater) setWaterCups(parseInt(savedWater));

    const savedScore = localStorage.getItem('efe_user_score');
    if (savedScore) setScore(parseInt(savedScore));

    const savedSteps = localStorage.getItem('efe_steps_today');
    if (savedSteps) {
      setSteps(parseInt(savedSteps));
    } else {
      // Simula passos iniciais aleatórios
      const randomInitial = Math.floor(Math.random() * 3000) + 2000;
      setSteps(randomInitial);
      localStorage.setItem('efe_steps_today', randomInitial);
    }

    const savedLevel = localStorage.getItem('efe_challenge_level') || 'leve';
    setChallengeLevel(savedLevel);
  }, []);

  // Monitorar nível do desafio
  useEffect(() => {
    const savedCheckedDays = localStorage.getItem(`efe_challenge_days_${challengeLevel}`);
    if (savedCheckedDays) {
      setCheckedDays(JSON.parse(savedCheckedDays));
    } else {
      // Mock inicial
      let initialChecked = [1, 2, 3, 4];
      if (challengeLevel === 'moderado') initialChecked = [1, 2];
      else if (challengeLevel === 'pesado') initialChecked = [1];
      setCheckedDays(initialChecked);
      localStorage.setItem(`efe_challenge_days_${challengeLevel}`, JSON.stringify(initialChecked));
    }
  }, [challengeLevel]);

  // Adicionar Copo de Água
  const addWater = (amount) => {
    const newCups = Math.max(0, waterCups + amount);
    setWaterCups(newCups);
    localStorage.setItem('efe_water_today', newCups);
    
    // Adiciona pontos
    if (amount > 0 && newCups <= waterGoal) {
      const newScore = score + 10;
      setScore(newScore);
      localStorage.setItem('efe_user_score', newScore);
    }
  };

  // Check-in Desafio de 30 Dias
  const handleCheckIn = (day) => {
    if (checkedDays.includes(day)) return;

    const newChecked = [...checkedDays, day];
    setCheckedDays(newChecked);
    localStorage.setItem(`efe_challenge_days_${challengeLevel}`, JSON.stringify(newChecked));

    const newScore = score + 50;
    setScore(newScore);
    localStorage.setItem('efe_user_score', newScore);
  };

  // Simular Sensor de Passos
  const simulateStep = () => {
    const extraSteps = Math.floor(Math.random() * 150) + 50;
    const newSteps = steps + extraSteps;
    setSteps(newSteps);
    localStorage.setItem('efe_steps_today', newSteps);

    if (newSteps >= stepsGoal && steps < stepsGoal) {
      const newScore = score + 100; // Bônus de meta batida
      setScore(newScore);
      localStorage.setItem('efe_user_score', newScore);
    }
  };

  const handleLevelChange = (level) => {
    setChallengeLevel(level);
    localStorage.setItem('efe_challenge_level', level);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Resumo Rápido */}
      <div className="grid-3">
        <div className="card glass flex-between" style={{ padding: '20px' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Pontuação Total</span>
            <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>
              {score} pts
            </h2>
          </div>
          <Trophy size={40} style={{ color: 'var(--primary)', opacity: 0.8 }} />
        </div>

        <div className="card glass flex-between" style={{ padding: '20px' }} onClick={simulateStep}>
          <div style={{ cursor: 'pointer' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Passos Diários</span>
            <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--accent-blue)', marginTop: '4px' }}>
              {steps.toLocaleString()}
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Meta: {stepsGoal} passos (Clique para andar)</span>
          </div>
          <Footprints size={40} style={{ color: 'var(--accent-blue)', opacity: 0.8 }} />
        </div>

        <div className="card glass flex-between" style={{ padding: '20px' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Nível de Cuidado</span>
            <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--accent-green)', marginTop: '4px' }}>
              {score >= 300 ? 'Avançado' : score >= 150 ? 'Intermediário' : 'Iniciante'}
            </h2>
          </div>
          <Award size={40} style={{ color: 'var(--accent-green)', opacity: 0.8 }} />
        </div>
      </div>

      <div className="grid-2">
        {/* Painel de Hidratação */}
        <div className="card glass water-container">
          <h3 className="card-title">
            <Droplet size={20} style={{ color: 'var(--accent-blue)' }} />
            Controle de Hidratação
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Consuma 2.5L de água por dia para manter o corpo em alta performance.
          </p>

          <div className="water-wheel">
            <div 
              className="water-wave" 
              style={{ height: `${Math.min(100, (waterCups / waterGoal) * 100)}%` }}
            />
            <div className="water-text">
              {waterCups * 250} <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>ml</span>
            </div>
            <div style={{ position: 'relative', zIndex: 2, fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Meta: {waterGoal} copos
            </div>
          </div>
          <div className="water-actions">
            <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => addWater(-1)}>-</button>
            <button className="btn btn-primary btn-sm" style={{ flex: 2 }} onClick={() => addWater(1)}>+ Copo (250ml)</button>
          </div>
        </div>

        {/* Desafio de 30 dias */}
        <div className="card glass">
          <div className="flex-between" style={{ flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
            <h3 className="card-title" style={{ marginBottom: 0 }}>
              <Target size={20} style={{ color: 'var(--accent-orange)' }} />
              Desafios de Saúde Natural
            </h3>
            
            {/* Seletor de Dificuldade */}
            <div className="tab-container" style={{ margin: 0, padding: '4px', background: 'var(--border-color)', borderRadius: 'var(--radius-md)', display: 'flex', gap: '4px' }}>
              {['leve', 'moderado', 'pesado'].map((level) => (
                <button
                  key={level}
                  onClick={() => {
                    handleLevelChange(level);
                    setSelectedDay(1); // Reiniciar visualização para o Dia 1
                  }}
                  className={`tab-btn ${challengeLevel === level ? 'active' : ''}`}
                  style={{ 
                    fontSize: '0.75rem', 
                    padding: '6px 12px', 
                    borderRadius: 'var(--radius-sm)',
                    background: challengeLevel === level ? 'var(--bg-card)' : 'transparent',
                    border: 'none',
                    color: challengeLevel === level ? 'var(--primary)' : 'var(--text-secondary)'
                  }}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Selecione o nível e complete os desafios diários para exercitar o físico, mental e espiritual.
          </p>

          {/* Alerta de Cuidado para o nível Pesado */}
          {challengeLevel === 'pesado' && (
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              padding: '16px', 
              background: 'rgba(239, 68, 68, 0.08)', 
              border: '1px solid rgba(239, 68, 68, 0.2)', 
              borderRadius: 'var(--radius-md)', 
              marginBottom: '20px',
              color: 'var(--text-primary)' 
            }}>
              <AlertTriangle size={32} style={{ color: 'var(--danger)', flexShrink: 0 }} />
              <div>
                <strong style={{ fontSize: '0.88rem', display: 'block', color: 'var(--danger)', marginBottom: '4px' }}>Aviso de Segurança:</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  Os desafios pesados exigem alta intensidade cardiovascular e muscular. Mantenha boa postura, mantenha-se altamente hidratado(a) e <strong>pare imediatamente</strong> em caso de dor intensa, tontura ou mal-estar. Consulte seu médico para atividades pesadas.
                </span>
              </div>
            </div>
          )}
 
          <div className="challenge-grid">
            {(challenges[challengeLevel] || []).map((c) => {
              const day = c.day;
              const isChecked = checkedDays.includes(day);
              const isSelected = day === selectedDay;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  style={{
                    padding: '12px 6px',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    background: isChecked 
                      ? 'var(--accent-green-light)' 
                      : isSelected
                        ? 'var(--primary-light)' 
                        : 'rgba(255,255,255,0.05)',
                    color: isChecked 
                      ? 'var(--accent-green)' 
                      : isSelected 
                        ? 'var(--primary)' 
                        : 'var(--text-muted)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ fontSize: '0.7rem' }}>Dia</span>
                  <span style={{ fontSize: '1.1rem' }}>{day}</span>
                  {isChecked && <CheckCircle2 size={12} />}
                </button>
              );
            })}
          </div>
 
          {/* Card Detalhado do Desafio Selecionado */}
          {challenges[challengeLevel]?.[selectedDay - 1] && (
            <div style={{ marginTop: '24px', padding: '20px', background: 'var(--border-color)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="flex-between" style={{ flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Desafio do Dia {selectedDay} ({challengeLevel})</span>
                  <strong style={{ fontSize: '1.1rem', display: 'block', color: 'var(--text-primary)', marginTop: '2px' }}>
                    {challenges[challengeLevel][selectedDay - 1].title}
                  </strong>
                </div>
                
                <button 
                  className="btn btn-primary btn-sm" 
                  style={{ padding: '8px 16px', alignSelf: 'flex-start' }}
                  onClick={() => handleCheckIn(selectedDay)}
                  disabled={checkedDays.includes(selectedDay)}
                >
                  {checkedDays.includes(selectedDay) ? 'Concluído ✓' : 'Realizar Check-in'}
                </button>
              </div>

              <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '12px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block' }}>Tarefa Diária:</span>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginTop: '4px' }}>
                  {challenges[challengeLevel][selectedDay - 1].task}
                </p>
              </div>

              <div style={{ padding: '12px 16px', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid var(--accent-orange)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-orange)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertTriangle size={14} /> Cuidados Físicos Recomentados:
                </span>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {challenges[challengeLevel][selectedDay - 1].care}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
 
      {/* Seção de Conquistas e Recompensas */}
      <div className="card glass">
        <h3 className="card-title">
          <Award size={20} style={{ color: 'var(--primary)' }} />
          Suas Conquistas
        </h3>
        <div className="achievements-grid" style={{ marginTop: '16px' }}>
          <div className="flex-center" style={{ flexDirection: 'column', gap: '8px', padding: '16px', background: 'rgba(139,92,246,0.05)', borderRadius: 'var(--radius-md)' }}>
            <Award size={32} style={{ color: 'var(--primary)' }} />
            <strong style={{ fontSize: '0.85rem' }}>Primeiro Passo</strong>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Calculou seu IMC</span>
          </div>
          <div className="flex-center" style={{ flexDirection: 'column', gap: '8px', padding: '16px', background: waterCups >= 5 ? 'rgba(6,182,212,0.05)' : 'transparent', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)', opacity: waterCups >= 5 ? 1 : 0.5 }}>
            <Droplet size={32} style={{ color: 'var(--accent-blue)' }} />
            <strong style={{ fontSize: '0.85rem' }}>Super Hidratado</strong>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Bebeu 5+ copos</span>
          </div>
          <div className="flex-center" style={{ flexDirection: 'column', gap: '8px', padding: '16px', background: checkedDays.length >= 5 ? 'rgba(249,115,22,0.05)' : 'transparent', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)', opacity: checkedDays.length >= 5 ? 1 : 0.5 }}>
            <Target size={32} style={{ color: 'var(--accent-orange)' }} />
            <strong style={{ fontSize: '0.85rem' }}>Foco de Aço</strong>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>5 dias de Desafio</span>
          </div>
          <div className="flex-center" style={{ flexDirection: 'column', gap: '8px', padding: '16px', background: steps >= stepsGoal ? 'rgba(16,185,129,0.05)' : 'transparent', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)', opacity: steps >= stepsGoal ? 1 : 0.5 }}>
            <Footprints size={32} style={{ color: 'var(--accent-green)' }} />
            <strong style={{ fontSize: '0.85rem' }}>Maratonista</strong>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Bateu a meta de passos</span>
          </div>
        </div>
      </div>
    </div>
  );
}
