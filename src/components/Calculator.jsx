import React, { useState } from 'react';
import { Calculator as CalcIcon, Activity, Flame, Award, BookOpen, UtensilsCrossed, Dumbbell, ArrowRight } from 'lucide-react';
import { recipes, devotionals } from '../data/recipes';
import { exercises } from '../data/exercises';

export default function Calculator({ setActiveTab, user }) {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [activity, setActivity] = useState('1.2');
  const [goal, setGoal] = useState('maintenance');
  const [results, setResults] = useState(null);

  const calculateResults = (e) => {
    e.preventDefault();
    if (!weight || !height || !age) return;

    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    const a = parseInt(age);

    // 1. Calcular IMC (Classificação OMS)
    const imc = w / (h * h);
    let imcCategory = '';
    if (imc < 18.5) imcCategory = 'Abaixo do peso';
    else if (imc < 24.9) imcCategory = 'Peso normal';
    else if (imc < 29.9) imcCategory = 'Sobrepeso';
    else if (imc < 34.9) imcCategory = 'Obesidade Grau I (Moderada)';
    else if (imc < 39.9) imcCategory = 'Obesidade Grau II (Severa/Crítica)';
    else imcCategory = 'Obesidade Grau III (Mórbida/Super Crítica)';

    // 2. Calcular TMB (Mifflin-St Jeor)
    let tmb = 0;
    if (gender === 'male') {
      tmb = 10 * w + 6.25 * (h * 100) - 5 * a + 5;
    } else {
      tmb = 10 * w + 6.25 * (h * 100) - 5 * a - 161;
    }

    const get = tmb * parseFloat(activity);

    // 3. Metas específicas baseadas no objetivo
    let targetCalories = get;
    let protein = w * 2.0;
    let fat = w * 1.0;

    if (goal === 'lose') {
      targetCalories = get - 500;
      protein = w * 2.2;
    } else if (goal === 'gain') {
      targetCalories = get + 400;
      protein = w * 1.8;
    }

    const remainingCalories = targetCalories - (protein * 4) - (fat * 9);
    let carbs = Math.max(50, remainingCalories / 4);

    // 4. Seleção Dinâmica de Sugestões e.f.e baseadas no objetivo
    let recommendedRecipe = null;
    let recommendedExercise = null;
    let recommendedDevotional = null;

    if (goal === 'lose') {
      recommendedRecipe = recipes.find(r => r.category === 'Emagrecimento') || recipes[0];
      recommendedExercise = exercises.find(ex => ex.category === 'Cardio') || exercises[2];
      recommendedDevotional = devotionals.find(d => d.id === 2) || devotionals[1]; // Equilíbrio em tudo
    } else if (goal === 'gain') {
      recommendedRecipe = recipes.find(r => r.category === 'Hipertrofia') || recipes[1];
      recommendedExercise = exercises.find(ex => ex.target.includes('Pernas') || ex.target.includes('Peitoral')) || exercises[0];
      recommendedDevotional = devotionals.find(d => d.id === 3) || devotionals[2]; // Renovação das forças
    } else {
      recommendedRecipe = recipes.find(r => r.category === 'Saúde Geral') || recipes[2];
      recommendedExercise = exercises.find(ex => ex.category === 'Alongamento') || exercises[4];
      recommendedDevotional = devotionals.find(d => d.id === 1) || devotionals[0]; // O templo do Espírito
    }

    setResults({
      imc: imc.toFixed(1),
      imcCategory,
      tmb: Math.round(tmb),
      get: Math.round(get),
      targetCalories: Math.round(targetCalories),
      protein: Math.round(protein),
      fat: Math.round(fat),
      carbs: Math.round(carbs),
      recipe: recommendedRecipe,
      exercise: recommendedExercise,
      devotional: recommendedDevotional
    });

    // Salvar informações corporais no LocalStorage
    const savedProfile = { weight: w, height: h * 100, imc: imc.toFixed(1), date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) };
    const history = JSON.parse(localStorage.getItem('efe_weight_history') || '[]');
    history.push(savedProfile);
    localStorage.setItem('efe_weight_history', JSON.stringify(history));
    localStorage.setItem('efe_user_stats', JSON.stringify({ 
      weight: w, 
      imc: imc.toFixed(1),
      targetCalories: Math.round(targetCalories),
      goal: goal,
      gender: gender
    }));
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Bloco principal de entrada e saída rápida */}
      <div className="card glass">
        <h2 className="card-title">
          <CalcIcon size={24} style={{ color: 'var(--primary)' }} />
          Calculadora de Saúde Natural
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Calcule seu Índice de Massa Corporal (IMC), Gasto Energético (TMB) e defina metas calóricas para o seu plano físico.
        </p>

        <div className="grid-2">
          <form onSubmit={calculateResults}>
            <div className="grid-2">
              <div className="input-group">
                <label>Peso (kg)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Ex: 75"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label>Altura (cm)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Ex: 175"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="input-group">
                <label>Idade (anos)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Ex: 28"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label>Gênero</label>
                <select
                  className="form-control"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="male">Masculino</option>
                  <option value="female">Feminino</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label>Nível de Atividade Física</label>
              <select
                className="form-control"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
              >
                <option value="1.2">Sedentário (pouco ou nenhum exercício)</option>
                <option value="1.375">Levemente ativo (exercício 1-3 dias/semana)</option>
                <option value="1.55">Moderadamente ativo (exercício 3-5 dias/semana)</option>
                <option value="1.725">Muito ativo (exercício diário intenso)</option>
              </select>
            </div>

            <div className="input-group">
              <label>Seu Objetivo Principal</label>
              <select
                className="form-control"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              >
                <option value="lose">Emagrecer (Perda de Gordura)</option>
                <option value="maintenance">Manter o Peso Saudável</option>
                <option value="gain">Ganhar Massa (Hipertrofia)</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }}>
              Calcular Parâmetros
            </button>
          </form>

          {/* Área de Resultados da Calculadora */}
          <div className="flex-center" style={{ flexDirection: 'column' }}>
            {results ? (
              <div className="fade-in" style={{ width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <p style={{ fontSize: '0.92rem', color: 'var(--primary)', fontWeight: 800, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Olá, {user?.name || 'Visitante'}! Seu IMC
                  </p>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                    Atual
                  </span>
                  <h1 style={{ fontSize: '3.5rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--primary)' }}>
                    {results.imc}
                  </h1>
                  <span style={{
                    padding: '6px 16px',
                    borderRadius: '50px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    background: results.imcCategory === 'Peso normal' 
                      ? 'var(--accent-green-light)' 
                      : (results.imcCategory === 'Abaixo do peso' || results.imcCategory === 'Sobrepeso')
                        ? 'var(--accent-orange-light)' 
                        : 'var(--danger-light)',
                    color: results.imcCategory === 'Peso normal' 
                      ? 'var(--accent-green)' 
                      : (results.imcCategory === 'Abaixo do peso' || results.imcCategory === 'Sobrepeso')
                        ? 'var(--accent-orange)' 
                        : 'var(--danger)'
                  }}>
                    {results.imcCategory}
                  </span>
                </div>

                <div className="grid-2" style={{ gap: '16px' }}>
                  <div className="card glass flex-center" style={{ padding: '16px', flexDirection: 'column', gap: '8px' }}>
                    <Flame size={20} style={{ color: 'var(--accent-orange)' }} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Metabolismo Basal (TMB)</span>
                    <strong style={{ fontSize: '1.25rem', fontWeight: 800 }}>{results.tmb} kcal</strong>
                  </div>
                  <div className="card glass flex-center" style={{ padding: '16px', flexDirection: 'column', gap: '8px' }}>
                    <Activity size={20} style={{ color: 'var(--accent-blue)' }} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Meta de Consumo Diário</span>
                    <strong style={{ fontSize: '1.25rem', fontWeight: 800 }}>{results.targetCalories} kcal</strong>
                  </div>
                </div>

                <div style={{ marginTop: '24px' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px' }}>Divisão de Macronutrientes</h4>
                  <div className="grid-3" style={{ gap: '12px', textAlign: 'center' }}>
                    <div style={{ padding: '10px', background: 'rgba(139, 92, 246, 0.08)', borderRadius: 'var(--radius-md)' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Proteínas</span>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>{results.protein}g</h4>
                    </div>
                    <div style={{ padding: '10px', background: 'rgba(6, 182, 212, 0.08)', borderRadius: 'var(--radius-md)' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Carboidratos</span>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-blue)' }}>{results.carbs}g</h4>
                    </div>
                    <div style={{ padding: '10px', background: 'rgba(249, 115, 22, 0.08)', borderRadius: 'var(--radius-md)' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Gorduras</span>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-orange)' }}>{results.fat}g</h4>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', opacity: 0.6 }}>
                <Activity size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
                <p>Preencha os dados e clique em calcular para obter os resultados e.f.e personalizados.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RECOMENDAÇÕES PERSONALIZADAS (E.F.E SUGGESTIONS ENGINE) */}
      {results && (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Award size={24} style={{ color: 'var(--primary)' }} />
            Sugestões Personalizadas para Seu Perfil
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '-12px' }}>
            Com base nos seus cálculos e no objetivo de <strong>{goal === 'lose' ? 'Emagrecimento' : goal === 'gain' ? 'Hipertrofia' : 'Manutenção'}</strong>, recomendamos:
          </p>

          <div className="grid-3">
            {/* Recomendação de Alimentação */}
            {results.recipe && (
              <div className="card glass flex-between" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '20px', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ padding: '8px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '50%' }}>
                    <UtensilsCrossed size={20} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Alimentação Sugerida</span>
                    <strong style={{ display: 'block', fontSize: '0.95rem' }}>{results.recipe.name}</strong>
                  </div>
                </div>
                
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineBreak: 'strict' }}>
                  Ideal para {results.recipe.category.toLowerCase()}, contendo apenas {results.recipe.calories} por porção.
                </p>

                <button 
                  onClick={() => setActiveTab('recipes')} 
                  className="btn btn-secondary btn-sm" 
                  style={{ width: '100%', justifyContent: 'space-between', padding: '8px 12px' }}
                >
                  <span>Ver receita completa</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}

            {/* Recomendação de Exercício */}
            {results.exercise && (
              <div className="card glass flex-between" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '20px', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ padding: '8px', background: 'var(--accent-blue-light)', color: 'var(--accent-blue)', borderRadius: '50%' }}>
                    <Dumbbell size={20} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Exercício Recomendado</span>
                    <strong style={{ display: 'block', fontSize: '0.95rem' }}>{results.exercise.name}</strong>
                  </div>
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Treino de {results.exercise.target.toLowerCase()}. Queima estimada: {results.exercise.burnRate}.
                </p>

                <button 
                  onClick={() => setActiveTab('exercises')} 
                  className="btn btn-secondary btn-sm" 
                  style={{ width: '100%', justifyContent: 'space-between', padding: '8px 12px' }}
                >
                  <span>Ver ilustrações e timer</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}

            {/* Recomendação Espiritual */}
            {results.devotional && (
              <div className="card glass flex-between" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '20px', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ padding: '8px', background: 'var(--accent-green-light)', color: 'var(--accent-green)', borderRadius: '50%' }}>
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Porção Bíblica do Dia</span>
                    <strong style={{ display: 'block', fontSize: '0.95rem' }}>{results.devotional.title}</strong>
                  </div>
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                  "{results.devotional.verse}" — {results.devotional.reference}
                </p>

                <button 
                  onClick={() => setActiveTab('reminders')} 
                  className="btn btn-secondary btn-sm" 
                  style={{ width: '100%', justifyContent: 'space-between', padding: '8px 12px' }}
                >
                  <span>Ler reflexão e orar</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
