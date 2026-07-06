import React, { useState, useEffect } from 'react';
import { Shield, Plus, Trash2, BookOpen, Dumbbell, Award, Check } from 'lucide-react';
import { recipes as defaultRecipes } from '../data/recipes';
import { exercises as defaultExercises } from '../data/exercises';
import { challenges as defaultChallenges } from '../data/challenges';

export default function Admin() {
  const [activeManager, setActiveManager] = useState('recipes'); // recipes, exercises, challenges
  
  // Custom states loaded from localStorage
  const [recipes, setRecipes] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [challenges, setChallenges] = useState({ leve: [], moderado: [], pesado: [] });

  // Form states
  const [successMsg, setSuccessMsg] = useState('');

  // Form: Recipe
  const [recName, setRecName] = useState('');
  const [recCat, setRecCat] = useState('Emagrecimento');
  const [recTime, setRecTime] = useState('15 min');
  const [recCal, setRecCal] = useState('150 kcal');
  const [recDiff, setRecDiff] = useState('Fácil');
  const [recIngs, setRecIngs] = useState('');
  const [recDirs, setRecDirs] = useState('');

  // Form: Exercise
  const [exName, setExName] = useState('');
  const [exCat, setExCat] = useState('Cardio');
  const [exTarget, setExTarget] = useState('Corpo Inteiro');
  const [exDur, setExDur] = useState('3 séries de 12 repetições');
  const [exDiff, setExDiff] = useState('Iniciante');
  const [exDesc, setExDesc] = useState('');

  // Form: Challenge
  const [chaLevel, setChaLevel] = useState('leve');
  const [chaDay, setChaDay] = useState(9);
  const [chaTitle, setChaTitle] = useState('');
  const [chaDetail, setChaDetail] = useState('');
  const [chaWarning, setChaWarning] = useState('');

  useEffect(() => {
    // Load lists from local storage or defaults
    const storedRecipes = JSON.parse(localStorage.getItem('efe_custom_recipes') || '[]');
    setRecipes([...storedRecipes, ...defaultRecipes]);

    const storedExercises = JSON.parse(localStorage.getItem('efe_custom_exercises') || '[]');
    setExercises([...storedExercises, ...defaultExercises]);

    const storedChallenges = JSON.parse(localStorage.getItem('efe_custom_challenges'));
    if (storedChallenges) {
      setChallenges(storedChallenges);
    } else {
      setChallenges(defaultChallenges);
    }
  }, []);

  const triggerSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Add Recipe
  const handleAddRecipe = (e) => {
    e.preventDefault();
    if (!recName || !recIngs || !recDirs) return;

    const newRecipe = {
      id: `custom-rec-${Date.now()}`,
      name: recName,
      category: recCat,
      prepTime: recTime,
      calories: recCal,
      difficulty: recDiff,
      ingredients: recIngs.split(',').map(i => i.trim()),
      directions: recDirs.split('\n').map(d => d.trim()).filter(Boolean),
      image: "", // Use dynamic fruitBackground by default
      isCustom: true
    };

    const currentCustom = JSON.parse(localStorage.getItem('efe_custom_recipes') || '[]');
    const updatedCustom = [newRecipe, ...currentCustom];
    localStorage.setItem('efe_custom_recipes', JSON.stringify(updatedCustom));

    setRecipes([newRecipe, ...recipes]);
    
    // Reset Form
    setRecName('');
    setRecIngs('');
    setRecDirs('');
    triggerSuccess('Receita adicionada com sucesso!');
  };

  // Delete Recipe
  const handleDeleteRecipe = (id) => {
    const isCustom = id.startsWith('custom-');
    if (!isCustom) {
      alert('Apenas receitas inseridas manualmente pelo administrador podem ser excluídas!');
      return;
    }

    if (confirm('Deseja realmente excluir esta receita?')) {
      const currentCustom = JSON.parse(localStorage.getItem('efe_custom_recipes') || '[]');
      const updatedCustom = currentCustom.filter(r => r.id !== id);
      localStorage.setItem('efe_custom_recipes', JSON.stringify(updatedCustom));
      setRecipes(recipes.filter(r => r.id !== id));
      triggerSuccess('Receita excluída!');
    }
  };

  // Add Exercise
  const handleAddExercise = (e) => {
    e.preventDefault();
    if (!exName || !exDesc) return;

    const newExercise = {
      id: `custom-ex-${Date.now()}`,
      name: exName,
      category: exCat,
      target: exTarget,
      duration: exDur,
      difficulty: exDiff,
      description: exDesc,
      instructions: [exDesc],
      image: "",
      burnRate: "8 kcal/min",
      isCustom: true
    };

    const currentCustom = JSON.parse(localStorage.getItem('efe_custom_exercises') || '[]');
    const updatedCustom = [newExercise, ...currentCustom];
    localStorage.setItem('efe_custom_exercises', JSON.stringify(updatedCustom));

    setExercises([newExercise, ...exercises]);

    // Reset Form
    setExName('');
    setExDesc('');
    triggerSuccess('Exercício adicionado com sucesso!');
  };

  // Delete Exercise
  const handleDeleteExercise = (id) => {
    const isCustom = id.startsWith('custom-');
    if (!isCustom) {
      alert('Apenas exercícios criados pelo administrador podem ser excluídos!');
      return;
    }

    if (confirm('Deseja realmente excluir este exercício?')) {
      const currentCustom = JSON.parse(localStorage.getItem('efe_custom_exercises') || '[]');
      const updatedCustom = currentCustom.filter(e => e.id !== id);
      localStorage.setItem('efe_custom_exercises', JSON.stringify(updatedCustom));
      setExercises(exercises.filter(e => e.id !== id));
      triggerSuccess('Exercício excluído!');
    }
  };

  // Add Challenge
  const handleAddChallenge = (e) => {
    e.preventDefault();
    if (!chaTitle || !chaDetail) return;

    const newChallenge = {
      day: parseInt(chaDay),
      title: chaTitle,
      detail: chaDetail,
      warning: chaWarning || "Respeite os limites do seu corpo e hidrate-se.",
      isCustom: true
    };

    const currentCustom = JSON.parse(localStorage.getItem('efe_custom_challenges') || '{}');
    if (!currentCustom[chaLevel]) currentCustom[chaLevel] = [];
    currentCustom[chaLevel] = [newChallenge, ...currentCustom[chaLevel]];
    localStorage.setItem('efe_custom_challenges', JSON.stringify(currentCustom));

    const updatedList = { ...challenges };
    updatedList[chaLevel] = [newChallenge, ...updatedList[chaLevel]];
    setChallenges(updatedList);

    // Reset Form
    setChaTitle('');
    setChaDetail('');
    setChaWarning('');
    setChaDay(chaDay + 1);
    triggerSuccess(`Desafio do Dia ${chaDay} adicionado ao nível ${chaLevel}!`);
  };

  // Delete Challenge
  const handleDeleteChallenge = (level, day) => {
    if (confirm(`Deseja realmente excluir o desafio do Dia ${day} do nível ${level}?`)) {
      const currentCustom = JSON.parse(localStorage.getItem('efe_custom_challenges') || '{}');
      if (currentCustom[level]) {
        currentCustom[level] = currentCustom[level].filter(c => c.day !== day);
        localStorage.setItem('efe_custom_challenges', JSON.stringify(currentCustom));
      }

      const updatedList = { ...challenges };
      updatedList[level] = updatedList[level].filter(c => c.day !== day);
      setChallenges(updatedList);
      triggerSuccess('Desafio excluído!');
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Cabeçalho Admin */}
      <div className="card glass" style={{ borderLeft: '4px solid var(--primary)', display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 24px' }}>
        <Shield size={32} style={{ color: 'var(--primary)' }} />
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem' }}>Painel do Administrador (C.S.N)</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Gerenciamento e moderação de materiais, receitas e rotinas de treinos do aplicativo.</p>
        </div>
      </div>

      {successMsg && (
        <div style={{ padding: '12px', background: 'var(--accent-green-light)', color: 'var(--accent-green)', borderRadius: 'var(--radius-md)', fontWeight: 700, textAlign: 'center', fontSize: '0.9rem' }}>
          ✓ {successMsg}
        </div>
      )}

      {/* Tabs Administrador */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={() => setActiveManager('recipes')} 
          className={`btn ${activeManager === 'recipes' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <BookOpen size={16} /> Receitas/Frutas
        </button>
        <button 
          onClick={() => setActiveManager('exercises')} 
          className={`btn ${activeManager === 'exercises' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Dumbbell size={16} /> Exercícios
        </button>
        <button 
          onClick={() => setActiveManager('challenges')} 
          className={`btn ${activeManager === 'challenges' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Award size={16} /> Desafios 30 Dias
        </button>
      </div>

      <div className="grid-2">
        {/* Formulário de Inserção */}
        <div className="card glass">
          <h3 className="card-title" style={{ fontSize: '1.1rem' }}>
            <Plus size={18} /> Inserir Novo Material
          </h3>

          {activeManager === 'recipes' && (
            <form onSubmit={handleAddRecipe} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="login-input-group">
                <label>Nome da Receita</label>
                <input type="text" className="form-control" value={recName} onChange={(e) => setRecName(e.target.value)} placeholder="Ex: Salada de Frutas Especial" required />
              </div>
              <div className="grid-2" style={{ gap: '10px' }}>
                <div className="login-input-group">
                  <label>Categoria</label>
                  <select className="form-control" value={recCat} onChange={(e) => setRecCat(e.target.value)}>
                    <option value="Emagrecimento">Emagrecimento</option>
                    <option value="Hipertrofia">Hipertrofia</option>
                    <option value="Definição">Definição</option>
                    <option value="Saúde Geral">Saúde Geral</option>
                  </select>
                </div>
                <div className="login-input-group">
                  <label>Tempo de Preparo</label>
                  <input type="text" className="form-control" value={recTime} onChange={(e) => setRecTime(e.target.value)} required />
                </div>
              </div>
              <div className="grid-2" style={{ gap: '10px' }}>
                <div className="login-input-group">
                  <label>Calorias</label>
                  <input type="text" className="form-control" value={recCal} onChange={(e) => setRecCal(e.target.value)} required />
                </div>
                <div className="login-input-group">
                  <label>Dificuldade</label>
                  <input type="text" className="form-control" value={recDiff} onChange={(e) => setRecDiff(e.target.value)} required />
                </div>
              </div>
              <div className="login-input-group">
                <label>Ingredientes (Separados por vírgula)</label>
                <textarea className="form-control" rows={3} value={recIngs} onChange={(e) => setRecIngs(e.target.value)} placeholder="Ex: maçã, morango, chia, mel" required />
              </div>
              <div className="login-input-group">
                <label>Modo de Preparo (Uma etapa por linha)</label>
                <textarea className="form-control" rows={4} value={recDirs} onChange={(e) => setRecDirs(e.target.value)} placeholder="Etapa 1&#10;Etapa 2" required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>Salvar Receita</button>
            </form>
          )}

          {activeManager === 'exercises' && (
            <form onSubmit={handleAddExercise} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="login-input-group">
                <label>Nome do Exercício</label>
                <input type="text" className="form-control" value={exName} onChange={(e) => setExName(e.target.value)} placeholder="Ex: Prancha Lateral" required />
              </div>
              <div className="grid-2" style={{ gap: '10px' }}>
                <div className="login-input-group">
                  <label>Categoria</label>
                  <select className="form-control" value={exCat} onChange={(e) => setExCat(e.target.value)}>
                    <option value="Cardio">Cardio</option>
                    <option value="Força">Força</option>
                    <option value="Alongamento">Alongamento</option>
                  </select>
                </div>
                <div className="login-input-group">
                  <label>Foco Muscular</label>
                  <input type="text" className="form-control" value={exTarget} onChange={(e) => setExTarget(e.target.value)} placeholder="Ex: Abdômen Lateral" required />
                </div>
              </div>
              <div className="grid-2" style={{ gap: '10px' }}>
                <div className="login-input-group">
                  <label>Duração/Repetição</label>
                  <input type="text" className="form-control" value={exDur} onChange={(e) => setExDur(e.target.value)} required />
                </div>
                <div className="login-input-group">
                  <label>Dificuldade</label>
                  <input type="text" className="form-control" value={exDiff} onChange={(e) => setExDiff(e.target.value)} required />
                </div>
              </div>
              <div className="login-input-group">
                <label>Descrição do Exercício</label>
                <textarea className="form-control" rows={4} value={exDesc} onChange={(e) => setExDesc(e.target.value)} placeholder="Instruções de posicionamento e execução" required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>Salvar Exercício</button>
            </form>
          )}

          {activeManager === 'challenges' && (
            <form onSubmit={handleAddChallenge} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="grid-2" style={{ gap: '10px' }}>
                <div className="login-input-group">
                  <label>Nível do Desafio</label>
                  <select className="form-control" value={chaLevel} onChange={(e) => setChaLevel(e.target.value)}>
                    <option value="leve">Leve</option>
                    <option value="moderado">Moderado</option>
                    <option value="pesado">Pesado</option>
                  </select>
                </div>
                <div className="login-input-group">
                  <label>Dia (1 a 30)</label>
                  <input type="number" min="1" max="30" className="form-control" value={chaDay} onChange={(e) => setChaDay(e.target.value)} required />
                </div>
              </div>
              <div className="login-input-group">
                <label>Título do Desafio</label>
                <input type="text" className="form-control" value={chaTitle} onChange={(e) => setChaTitle(e.target.value)} placeholder="Ex: Hidratação Reforçada" required />
              </div>
              <div className="login-input-group">
                <label>Instrução Detalhada</label>
                <textarea className="form-control" rows={3} value={chaDetail} onChange={(e) => setChaDetail(e.target.value)} placeholder="Instruções do que o usuário deve fazer nesse dia." required />
              </div>
              <div className="login-input-group">
                <label>Aviso de Cuidado Físico / Dica Médica</label>
                <textarea className="form-control" rows={2} value={chaWarning} onChange={(e) => setChaWarning(e.target.value)} placeholder="Ex: Pessoas com dor lombar devem fazer alongamento de joelhos." />
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>Salvar Desafio</button>
            </form>
          )}
        </div>

        {/* Listagem de Edição/Exclusão */}
        <div className="card glass" style={{ maxHeight: '600px', overflowY: 'auto' }}>
          <h3 className="card-title" style={{ fontSize: '1.1rem' }}>
            Materiais Cadastrados
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {activeManager === 'recipes' && recipes.map((r) => (
              <div key={r.id} className="flex-between" style={{ padding: '12px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{r.name}</strong>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{r.category} • {r.prepTime} • {r.isCustom ? 'Inserido' : 'Padrão'}</span>
                </div>
                {r.isCustom && (
                  <button onClick={() => handleDeleteRecipe(r.id)} className="btn btn-secondary btn-sm" style={{ padding: '6px', color: 'var(--danger)' }}>
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}

            {activeManager === 'exercises' && exercises.map((ex) => (
              <div key={ex.id} className="flex-between" style={{ padding: '12px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{ex.name}</strong>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{ex.category} • {ex.target} • {ex.isCustom ? 'Inserido' : 'Padrão'}</span>
                </div>
                {ex.isCustom && (
                  <button onClick={() => handleDeleteExercise(ex.id)} className="btn btn-secondary btn-sm" style={{ padding: '6px', color: 'var(--danger)' }}>
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}

            {activeManager === 'challenges' && (
              ['leve', 'moderado', 'pesado'].map((level) => (
                <div key={level} style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '8px' }}>Nível {level}</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {challenges[level]?.map((c, idx) => (
                      <div key={idx} className="flex-between" style={{ padding: '10px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                        <div>
                          <strong style={{ fontSize: '0.82rem' }}>Dia {c.day}: {c.title}</strong>
                          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{c.isCustom ? 'Customizado' : 'Padrão'}</span>
                        </div>
                        {c.isCustom && (
                          <button onClick={() => handleDeleteChallenge(level, c.day)} className="btn btn-secondary btn-sm" style={{ padding: '4px', color: 'var(--danger)' }}>
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
