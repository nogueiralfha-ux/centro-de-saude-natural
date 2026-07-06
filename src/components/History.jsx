import React, { useState, useEffect } from 'react';
import { TrendingUp, Scale, Calendar, ArrowDown, ArrowUp, Minus } from 'lucide-react';

export default function History() {
  const [history, setHistory] = useState([]);
  const [weight, setWeight] = useState('');
  const [recordDate, setRecordDate] = useState(new Date().toISOString().substring(0, 10)); // Default to today
  const [chest, setChest] = useState('');
  const [waist, setWaist] = useState('');
  const [hip, setHip] = useState('');

  useEffect(() => {
    const savedHistory = localStorage.getItem('efe_weight_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    } else {
      // Mock inicial distribuído mês a mês com perda de peso real para demonstrar a curva
      const initialMock = [
        { date: '15/01', weight: 82.0, imc: 26.8, chest: 102, waist: 94, hip: 106 },
        { date: '15/02', weight: 80.5, imc: 26.3, chest: 101, waist: 92, hip: 105 },
        { date: '15/03', weight: 79.0, imc: 25.8, chest: 100, waist: 90, hip: 104 },
        { date: '15/04', weight: 78.2, imc: 25.5, chest: 99, waist: 89, hip: 103 },
        { date: '15/05', weight: 77.0, imc: 25.1, chest: 98, waist: 87, hip: 102 },
        { date: '15/06', weight: 76.0, imc: 24.8, chest: 98, waist: 86, hip: 102 }
      ];
      setHistory(initialMock);
      localStorage.setItem('efe_weight_history', JSON.stringify(initialMock));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!weight || !recordDate) return;

    const userStats = JSON.parse(localStorage.getItem('efe_user_stats') || '{"height": 175}');
    const h = parseFloat(userStats.height || 175) / 100;
    const w = parseFloat(weight);
    const calculatedImc = (w / (h * h)).toFixed(1);

    // Formatar data selecionada para "DD/MM" para exibição simplificada
    const [year, month, day] = recordDate.split('-');
    const formattedDate = `${day}/${month}`;

    const newEntry = {
      rawDate: recordDate, // Para ordenação cronológica precisa
      date: formattedDate,
      weight: w,
      imc: parseFloat(calculatedImc),
      chest: chest ? parseFloat(chest) : null,
      waist: waist ? parseFloat(waist) : null,
      hip: hip ? parseFloat(hip) : null
    };

    // Adiciona e ordena cronologicamente
    let newHistory = [...history, newEntry];
    newHistory.sort((a, b) => {
      const dateA = a.rawDate || `2026-${a.date.split('/')[1]}-${a.date.split('/')[0]}`;
      const dateB = b.rawDate || `2026-${b.date.split('/')[1]}-${b.date.split('/')[0]}`;
      return new Date(dateA) - new Date(dateB);
    });

    setHistory(newHistory);
    localStorage.setItem('efe_weight_history', JSON.stringify(newHistory));
    localStorage.setItem('efe_user_stats', JSON.stringify({ ...userStats, weight: w, imc: calculatedImc }));

    setWeight('');
    setChest('');
    setWaist('');
    setHip('');
    setRecordDate(new Date().toISOString().substring(0, 10)); // Reset date to today
  };

  const getSvgPoints = () => {
    if (history.length === 0) return [];
    const weights = history.map(h => h.weight);
    const minW = Math.min(...weights) - 2;
    const maxW = Math.max(...weights) + 2;
    const range = maxW - minW || 1;

    const width = 600;
    const height = 180;
    const paddingX = 40;
    const paddingY = 30;

    return history.map((entry, idx) => {
      const x = paddingX + (idx / (history.length - 1 || 1)) * (width - paddingX * 2);
      const y = height - paddingY - ((entry.weight - minW) / range) * (height - paddingY * 2);
      return { x, y, weight: entry.weight, date: entry.date };
    });
  };

  const chartPoints = getSvgPoints();
  const polylinePoints = chartPoints.map(p => `${p.x},${p.y}`).join(' ');

  // Comparação de Evolução (Primeiro vs Último Registro)
  const getEvolutionStats = () => {
    if (history.length < 2) return null;
    const first = history[0];
    const latest = history[history.length - 1];

    const weightDiff = (latest.weight - first.weight).toFixed(1);
    const imcDiff = (latest.imc - first.imc).toFixed(1);
    
    const validWaists = history.filter(h => h.waist);
    const waistDiff = validWaists.length >= 2 
      ? (validWaists[validWaists.length - 1].waist - validWaists[0].waist).toFixed(1)
      : 0;

    return {
      firstWeight: first.weight,
      latestWeight: latest.weight,
      weightDiff,
      firstImc: first.imc,
      latestImc: latest.imc,
      imcDiff,
      firstWaist: validWaists[0]?.waist || null,
      latestWaist: validWaists[validWaists.length - 1]?.waist || null,
      waistDiff
    };
  };

  const evo = getEvolutionStats();

  const renderDifferenceBadge = (diff, isMeasurement = false) => {
    const val = parseFloat(diff);
    if (val < 0) {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', color: 'var(--accent-green)', fontWeight: 700, fontSize: '0.85rem' }}>
          <ArrowDown size={14} /> {Math.abs(val)}{isMeasurement ? 'cm' : 'kg'} (Redução)
        </span>
      );
    } else if (val > 0) {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', color: 'var(--accent-orange)', fontWeight: 700, fontSize: '0.85rem' }}>
          <ArrowUp size={14} /> +{val}{isMeasurement ? 'cm' : 'kg'} (Aumento)
        </span>
      );
    }
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.85rem' }}>
        <Minus size={14} /> Sem alteração
      </span>
    );
  };

  // Limpar histórico para resetar os testes do usuário
  const clearHistory = () => {
    if (window.confirm("Deseja realmente redefinir o histórico para a demonstração padrão?")) {
      localStorage.removeItem('efe_weight_history');
      window.location.reload();
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* 1. GRÁFICO DE PESO EM LARGURA TOTAL */}
      <div className="card glass">
        <div className="flex-between" style={{ marginBottom: '8px' }}>
          <h3 className="card-title" style={{ marginBottom: 0 }}>
            <TrendingUp size={22} style={{ color: 'var(--primary)' }} />
            Curva de Evolução do Peso (Mês a Mês)
          </h3>
          <button onClick={clearHistory} className="btn btn-secondary btn-sm" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
            Redefinir Histórico
          </button>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Acompanhe visualmente a trajetória do seu peso corporal de mês a mês.
        </p>
        
        {history.length > 1 ? (
          <div style={{ marginTop: '20px', padding: '10px 0' }}>
            <svg viewBox="0 0 600 180" style={{ width: '100%', overflow: 'visible' }}>
              <line x1="30" y1="30" x2="570" y2="30" stroke="var(--border-color)" strokeDasharray="4" />
              <line x1="30" y1="90" x2="570" y2="90" stroke="var(--border-color)" strokeDasharray="4" />
              <line x1="30" y1="150" x2="570" y2="150" stroke="var(--border-color)" strokeDasharray="4" />

              <polyline
                fill="none"
                stroke="var(--primary)"
                strokeWidth="3.5"
                points={polylinePoints}
              />

              {chartPoints.map((pt, idx) => (
                <g key={idx}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="6"
                    fill="var(--bg-primary)"
                    stroke="var(--primary)"
                    strokeWidth="3"
                  />
                  <text
                    x={pt.x}
                    y={pt.y - 12}
                    fontSize="10"
                    fontWeight="800"
                    fill="var(--text-primary)"
                    textAnchor="middle"
                  >
                    {pt.weight}kg
                  </text>
                  <text
                    x={pt.x}
                    y="170"
                    fontSize="9"
                    fontWeight="600"
                    fill="var(--text-secondary)"
                    textAnchor="middle"
                  >
                    {pt.date}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Insira novos registros de peso abaixo para desenhar a sua curva de evolução.
          </div>
        )}
      </div>

      {/* 2. CARDS DE COMPARAÇÃO / ANÁLISE DE NECESSIDADE */}
      {evo && (
        <div className="grid-3">
          <div className="card glass flex-between" style={{ padding: '20px', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Evolução de Peso</span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 800 }}>{evo.firstWeight}kg</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>➔</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>{evo.latestWeight}kg</span>
            </div>
            {renderDifferenceBadge(evo.weightDiff)}
          </div>

          <div className="card glass flex-between" style={{ padding: '20px', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Variação de IMC</span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 800 }}>{evo.firstImc}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>➔</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-blue)' }}>{evo.latestImc}</span>
            </div>
            {renderDifferenceBadge(evo.imcDiff)}
          </div>

          <div className="card glass flex-between" style={{ padding: '20px', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Evolução da Cintura</span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 800 }}>{evo.firstWaist ? `${evo.firstWaist}cm` : '-'}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>➔</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-green)' }}>{evo.latestWaist ? `${evo.latestWaist}cm` : '-'}</span>
            </div>
            {renderDifferenceBadge(evo.waistDiff, true)}
          </div>
        </div>
      )}

      {/* 3. FORMULÁRIO E TABELA DE HISTÓRICO LADO A LADO */}
      <div className="grid-2" style={{ alignItems: 'start' }}>
        
        {/* Formulário de Registro */}
        <div className="card glass" style={{ height: '100%' }}>
          <h3 className="card-title">
            <Scale size={20} style={{ color: 'var(--primary)' }} />
            Registrar Nova Medida
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Atualize seus dados escolhendo a data e as novas medidas.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <div className="input-group">
                <label>Peso Corporal Atual (kg) *</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  placeholder="Ex: 75.4"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                />
              </div>
              
              <div className="input-group">
                <label>Data do Registro *</label>
                <input
                  type="date"
                  className="form-control"
                  value={recordDate}
                  onChange={(e) => setRecordDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="measurements-form-grid">
              <div className="input-group">
                <label>Tórax (cm)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Ex: 95"
                  value={chest}
                  onChange={(e) => setChest(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>Cintura (cm)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Ex: 82"
                  value={waist}
                  onChange={(e) => setWaist(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>Quadril (cm)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Ex: 100"
                  value={hip}
                  onChange={(e) => setHip(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '24px' }}>
              Salvar Registro
            </button>
          </form>
        </div>

        {/* Tabela de Histórico */}
        <div className="card glass" style={{ height: '100%' }}>
          <h3 className="card-title">Tabela de Registros</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Consulte todas as suas medidas ordenadas de forma decrescente.
          </p>
          
          <div style={{ overflowX: 'auto', maxHeight: '250px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '8px 4px' }}>Data</th>
                  <th style={{ padding: '8px 4px' }}>Peso</th>
                  <th style={{ padding: '8px 4px' }}>IMC</th>
                  <th style={{ padding: '8px 4px' }}>Cintura</th>
                  <th style={{ padding: '8px 4px' }}>Quadril</th>
                </tr>
              </thead>
              <tbody>
                {history.slice().reverse().map((entry, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                    <td style={{ padding: '10px 4px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} /> {entry.date}
                    </td>
                    <td style={{ padding: '10px 4px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                      {entry.weight} kg
                    </td>
                    <td style={{ padding: '10px 4px' }}>
                      {entry.imc || '-'}
                    </td>
                    <td style={{ padding: '10px 4px' }}>
                      {entry.waist ? `${entry.waist}cm` : '-'}
                    </td>
                    <td style={{ padding: '10px 4px' }}>
                      {entry.hip ? `${entry.hip}cm` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
