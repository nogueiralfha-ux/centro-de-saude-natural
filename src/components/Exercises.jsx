import React, { useState, useEffect } from 'react';
import { Play, Square, RefreshCw, Flame, ChevronRight, Dumbbell, Award, Timer } from 'lucide-react';
import { exercises as defaultExercises, weeklyWorkouts } from '../data/exercises';
import exerciseBackground from '../assets/exercise_background.jpg';

export default function Exercises({ setActiveTab }) {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [activeWorkout, setActiveWorkout] = useState(null);

  // Estados do Cronômetro
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerPreset, setTimerPreset] = useState(30);

  const [userStats, setUserStats] = useState(null);
  const [activeDay, setActiveDay] = useState("Segunda-feira");
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    const stats = localStorage.getItem('efe_user_stats');
    if (stats) {
      setUserStats(JSON.parse(stats));
    }
    const customExercises = JSON.parse(localStorage.getItem('efe_custom_exercises') || '[]');
    setExercises([...customExercises, ...defaultExercises]);
  }, []);

  const getWeeklyWorkouts = () => {
    const goal = userStats?.goal || 'lose'; 
    const gender = userStats?.gender || 'female'; 

    const targetLabel = goal === 'lose' ? 'Queima de Gordura' : goal === 'gain' ? 'Ganho de Massa' : 'Equilíbrio e Saúde';
    const genderSuffix = gender === 'male' ? 'Masculino' : 'Feminino';

    return [
      {
        day: "Segunda-feira",
        name: `Treino de Pernas e Glúteos - Foco ${targetLabel} (${genderSuffix})`,
        duration: "25 min",
        target: "Inferiores",
        description: goal === 'gain' 
          ? "Foco em agachamentos e elevações para ganho muscular." 
          : "Foco em movimentos repetitivos e cardio-resistência para tônus e queima de calorias.",
        exercisesList: [
          "Agachamento Livre (3 séries de 15 repetições)",
          "Avanço / Passada Alternada (3 séries de 12 repetições por perna)",
          "Ponte de Glúteo no Solo (3 séries de 15 repetições)",
          "Panturrilha em Pé (3 séries de 20 repetições)"
        ]
      },
      {
        day: "Terça-feira",
        name: `Treino de Peito, Costas e Ombros (${genderSuffix})`,
        duration: "20 min",
        target: "Superiores",
        description: "Fortalecimento da postura e ativação dos membros superiores.",
        exercisesList: [
          "Flexão de Braço (Modificada de joelhos se necessário - 3 séries de 10)",
          "Remada Curvada com Halteres ou Garrafas de Água (3 séries de 12)",
          "Desenvolvimento de Ombros Sentado (3 séries de 12)",
          "Prancha Alta com Toques Alternados nos Ombros (3 séries de 10 repetições cada lado)"
        ]
      },
      {
        day: "Quarta-feira",
        name: `Treino de Core e Abdômen Trincado (${genderSuffix})`,
        duration: "15 min",
        target: "Abdômen",
        description: "Contração abdominal intensa e pranchas estabilizadoras.",
        exercisesList: [
          "Abdominal Tradicional Solo (3 séries de 15 repetições)",
          "Prancha Isométrica de Cotovelos (3 séries de 45 segundos)",
          "Abdominal Canivete Alternado (3 séries de 12 repetições)",
          "Toque nos Tornozelos Deitado (3 séries de 20 repetições)"
        ]
      },
      {
        day: "Quinta-feira",
        name: `Cardio de Alta Intensidade (HIIT) (${genderSuffix})`,
        duration: "25 min",
        target: "Corpo Inteiro",
        description: "Aceleração do metabolismo e queima calórica prolongada.",
        exercisesList: [
          "Polichinelos Velocidade (3 séries de 1 minuto contínuo)",
          "Corrida Estacionária com Joelhos Altos (3 séries de 45 segundos)",
          "Meio Burpee (Sem flexão - 3 séries de 8 repetições)",
          "Corrida Escalador na Prancha (3 séries de 45 segundos)"
        ]
      },
      {
        day: "Sexta-feira",
        name: `Fortalecimento de Braços e Tríceps (${genderSuffix})`,
        duration: "20 min",
        target: "Membros Superiores",
        description: "Tonificação dos braços utilizando o peso corporal.",
        exercisesList: [
          "Mergulho no Banco / Degrau (3 séries de 12 repetições)",
          "Rosca Direta com Pesos Livres (3 séries de 12 repetições)",
          "Tríceps Coice Unilateral (3 séries de 12 repetições)",
          "Flexão de Braço com Mãos Próximas (3 séries de 8 repetições)"
        ]
      },
      {
        day: "Sábado",
        name: `Alongamento Ativo e Mobilidade (${genderSuffix})`,
        duration: "20 min",
        target: "Flexibilidade",
        description: "Recuperação muscular, alongamentos profundos e alívio de tensões acumuladas.",
        exercisesList: [
          "Alongamento de Pescoço e Trapézio (1 minuto para cada lado)",
          "Alongamento de Posteriores de Coxa Sentado (2 minutos)",
          "Postura da Criança e do Cachorro Olhando para Baixo (3 séries de 30 segundos)",
          "Rotação Articular de Quadril e Tornozelos (2 minutos de mobilidade ativa)"
        ]
      },
      {
        day: "Domingo",
        name: "Avaliação Semanal de Progresso",
        duration: "5 min",
        target: "Recalibrar Parâmetros",
        description: "Parabéns por completar sua semana de treinos! Agora é o momento ideal para refazer o teste na Calculadora, acompanhar seu progresso e atualizar seus planos de acordo com o sexo e objetivo."
      }
    ];
  };

  const weeklyPlans = getWeeklyWorkouts();

  // Função para tocar o bip do alarme
  const playAlarmSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const playBeep = (delay, duration, frequency) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(frequency, ctx.currentTime + delay);
        
        gain.gain.setValueAtTime(0.3, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + duration);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + duration);
      };

      // Apito duplo agradável
      playBeep(0, 0.15, 880);
      playBeep(0.2, 0.25, 1200);
    } catch (e) {
      console.warn('Falha ao reproduzir áudio:', e);
    }
  };

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
      // Tocar som e vibrar o dispositivo
      playAlarmSound();
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const handleStartTimer = () => setIsTimerRunning(true);
  const handleStopTimer = () => setIsTimerRunning(false);
  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(timerPreset);
  };

  const changePreset = (sec) => {
    setTimerPreset(sec);
    setTimerSeconds(sec);
    setIsTimerRunning(false);
  };

  return (
    <div className="fade-in">
      <div className="grid-2">
        {/* Lado Esquerdo: Lista de Exercícios ou Treinos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Rotina Semanal */}
          <div className="card glass">
            <h3 className="card-title">
              <Award size={20} style={{ color: 'var(--primary)' }} />
              Rotina Semanal Integrada
            </h3>
            
            {/* Seletor de Dia da Semana */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '16px' }}>
              {weeklyPlans.map((wp) => (
                <button
                  key={wp.day}
                  onClick={() => setActiveDay(wp.day)}
                  className="btn btn-secondary btn-sm"
                  style={{
                    whiteSpace: 'nowrap',
                    padding: '8px 12px',
                    fontSize: '0.82rem',
                    background: activeDay === wp.day ? 'var(--primary-light)' : 'transparent',
                    color: activeDay === wp.day ? 'var(--primary)' : 'var(--text-secondary)',
                    borderColor: activeDay === wp.day ? 'var(--primary)' : 'var(--border-color)',
                    fontWeight: 700
                  }}
                >
                  {wp.day}
                </button>
              ))}
            </div>

            {/* Conteúdo do Dia */}
            {weeklyPlans.filter(wp => wp.day === activeDay).map((wp, idx) => (
              <div key={idx} className="fade-in" style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                {wp.day === 'Domingo' ? (
                  <div style={{ textAlign: 'center', padding: '10px 0' }}>
                    <h4 style={{ color: 'var(--primary)', fontWeight: 800, marginBottom: '8px' }}>{wp.name}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.5' }}>
                      {wp.description}
                    </p>
                    <button 
                      onClick={() => setActiveTab('calculator')} 
                      className="btn btn-primary btn-sm" 
                      style={{ width: '100%' }}
                    >
                      Refazer Teste na Calculadora ➔
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex-between" style={{ marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                        Foco: {wp.target}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        Duração: <strong>{wp.duration}</strong>
                      </span>
                    </div>
                    <strong style={{ fontSize: '0.95rem', display: 'block', color: 'var(--text-primary)', marginBottom: '6px' }}>
                      {wp.name}
                    </strong>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '12px' }}>
                      {wp.description}
                    </p>

                    {wp.exercisesList && (
                      <div style={{ marginTop: '12px', background: 'rgba(0,0,0,0.02)', padding: '12px', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--primary)' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                          Exercícios da Rotina:
                        </span>
                        <ol style={{ paddingLeft: '16px', margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                          {wp.exercisesList.map((exName, exIdx) => (
                            <li key={exIdx} style={{ marginBottom: '4px' }}>{exName}</li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Alerta de Recalibração Semanal */}
            <div style={{ 
              marginTop: '16px', 
              padding: '12px 16px', 
              borderRadius: 'var(--radius-md)', 
              background: 'rgba(139, 92, 246, 0.08)', 
              border: '1px solid rgba(139, 92, 246, 0.2)', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '6px' 
            }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                ⚠️ Reavaliação Semanal Obrigatória
              </span>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.4', margin: 0 }}>
                Para ambos os sexos (feminino e masculino), é essencial refazer os cálculos corporais na Calculadora a cada 7 dias. Seu corpo se adapta rápido, e recalibrar o peso garante que seu plano alimentar e de treinos continuem perfeitamente alinhados ao seu objetivo!
              </p>
            </div>
          </div>

          {/* Listagem de Exercícios Individual */}
          <div className="card glass">
            <h3 className="card-title">Explorar Exercícios</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {exercises.map((ex) => (
                <div 
                  key={ex.id}
                  className="flex-between"
                  style={{ 
                    padding: '12px 16px', 
                    borderRadius: 'var(--radius-md)', 
                    background: selectedExercise === ex ? 'var(--border-color)' : 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer' 
                  }}
                  onClick={() => setSelectedExercise(ex)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      backgroundImage: `url(${exerciseBackground})`, 
                      backgroundSize: 'cover', 
                      backgroundPosition: 'center',
                      borderRadius: '8px' 
                    }} />
                    <div>
                      <strong style={{ fontSize: '0.9rem' }}>{ex.name}</strong>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{ex.target}</span>
                    </div>
                  </div>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    padding: '2px 8px', 
                    borderRadius: '50px', 
                    background: 'var(--border-color)',
                    color: 'var(--text-secondary)'
                  }}>
                    {ex.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lado Direito: Temporizador e Detalhes do Exercício Ativo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Módulo do Temporizador Integrado */}
          <div className="card glass flex-center" style={{ flexDirection: 'column', padding: '24px' }}>
            <h3 className="card-title" style={{ width: '100%', justifyContent: 'flex-start' }}>
              <Timer size={20} style={{ color: 'var(--accent-orange)' }} />
              Temporizador de Exercício
            </h3>
            
            <div style={{ 
              fontSize: '3.5rem', 
              fontFamily: 'var(--font-display)', 
              fontWeight: 800, 
              color: 'var(--text-primary)',
              margin: '16px 0',
              position: 'relative'
            }}>
              {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <button onClick={() => changePreset(30)} className={`btn btn-secondary btn-sm ${timerPreset === 30 ? 'btn-primary' : ''}`}>30s</button>
              <button onClick={() => changePreset(45)} className={`btn btn-secondary btn-sm ${timerPreset === 45 ? 'btn-primary' : ''}`}>45s</button>
              <button onClick={() => changePreset(60)} className={`btn btn-secondary btn-sm ${timerPreset === 60 ? 'btn-primary' : ''}`}>1 min</button>
            </div>

            <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
              {!isTimerRunning ? (
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleStartTimer}>
                  <Play size={18} /> Iniciar
                </button>
              ) : (
                <button className="btn btn-secondary" style={{ flex: 1, background: 'var(--danger)', color: 'white' }} onClick={handleStopTimer}>
                  <Square size={18} /> Pausar
                </button>
              )}
              <button className="btn btn-secondary" onClick={handleResetTimer}>
                <RefreshCw size={18} />
              </button>
            </div>
          </div>

          {/* Detalhes do Exercício Selecionado */}
          {selectedExercise ? (
            <div className="card glass fade-in" style={{ padding: '24px' }}>
              <div style={{ 
                height: '180px', 
                backgroundImage: `url(${exerciseBackground})`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center',
                borderRadius: 'var(--radius-md)',
                marginBottom: '16px'
              }} />
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>{selectedExercise.name}</h3>
              <div style={{ display: 'flex', gap: '10px', fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '8px 0 16px' }}>
                <span>Foco: <strong>{selectedExercise.target}</strong></span>
                <span>Calorias: <strong>{selectedExercise.burnRate}</strong></span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                {selectedExercise.description}
              </p>

              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '8px' }}>Como Executar:</h4>
              <ol style={{ paddingLeft: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {selectedExercise.instructions.map((ins, idx) => (
                  <li key={idx} style={{ marginBottom: '6px' }}>{ins}</li>
                ))}
              </ol>
            </div>
          ) : (
            <div className="card glass flex-center" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', minHeight: '200px' }}>
              <p>Selecione um exercício ou rotina de treinos para ver as ilustrações e modo de execução.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
