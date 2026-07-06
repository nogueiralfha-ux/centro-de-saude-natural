import React, { useState, useEffect } from 'react';
import { Search, Flame, Clock, Award, BookOpen, ChevronRight, Check, Calendar } from 'lucide-react';
import { recipes as defaultRecipes, menuPlans } from '../data/recipes';
import fruitBackground from '../assets/fruit_background.jpg';

export default function Recipes() {
  const [activeSubTab, setActiveSubTab] = useState('recipes'); // recipes ou cardapios
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [activeDay, setActiveDay] = useState("Segunda-feira");
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const stats = localStorage.getItem('efe_user_stats');
    if (stats) {
      setUserStats(JSON.parse(stats));
    }
    const customRecipes = JSON.parse(localStorage.getItem('efe_custom_recipes') || '[]');
    setRecipes([...customRecipes, ...defaultRecipes]);
  }, []);

  const getDynamicMenuPlans = () => {
    if (!userStats) return menuPlans;

    return menuPlans.map(plan => {
      let title = plan.title;
      let objective = plan.objective;
      let caloricTarget = `${userStats.targetCalories} kcal/dia`;
      
      let mealsModifier = (mealName, originalFood) => {
        return originalFood;
      };

      if (userStats.goal === 'lose') {
        title = "Plano de Emagrecimento Personalizado";
        objective = "Redução de gordura corporal focada no seu déficit calórico calculado.";
        mealsModifier = (mealName, food) => {
          if (mealName === 'Almoço' || mealName === 'Jantar') {
            return `${food} (Manter porção moderada de carboidratos).`;
          }
          return food;
        };
      } else if (userStats.goal === 'gain') {
        title = "Plano de Ganho de Massa (Hipertrofia)";
        objective = "Superávit calórico controlado para hipertrofia muscular saudável.";
        mealsModifier = (mealName, food) => {
          if (mealName === 'Café da Manhã') {
            return `${food} + Adicionar 1 banana com mel e aveia.`;
          }
          if (mealName === 'Almoço' || mealName === 'Jantar') {
            return `${food} + Dobrar a porção de carboidratos complexos e adicionar 80g de proteína magra.`;
          }
          if (mealName === 'Lanche da Manhã' || mealName === 'Lanche da Tarde') {
            return `${food} + Acompanhar com 1 dose de Whey Protein ou iogurte proteico.`;
          }
          return food;
        };
      } else {
        title = "Plano de Manutenção e Saúde Natural";
        objective = "Equilíbrio de nutrientes para manter o peso estável e energia elevada.";
        mealsModifier = (mealName, food) => food;
      }

      return {
        ...plan,
        title,
        objective,
        caloricTarget,
        days: plan.days.map(d => ({
          ...d,
          meals: d.meals.map(m => ({
            ...m,
            food: mealsModifier(m.name, m.food)
          }))
        }))
      };
    });
  };

  const dynamicPlans = getDynamicMenuPlans();

  const categories = ['Todos', 'Emagrecimento', 'Hipertrofia', 'Definição', 'Saúde Geral'];

  // Filtrar receitas
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          recipe.ingredients.some(i => i.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'Todos' || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fade-in">
      {/* Sub Navegação interna */}
      <div className="tab-container">
        <button 
          className={`tab-btn ${activeSubTab === 'recipes' ? 'active' : ''}`}
          onClick={() => { setActiveSubTab('recipes'); setSelectedRecipe(null); }}
        >
          Banco de Receitas
        </button>
        <button 
          className={`tab-btn ${activeSubTab === 'cardapios' ? 'active' : ''}`}
          onClick={() => { setActiveSubTab('cardapios'); setSelectedRecipe(null); }}
        >
          Cardápios Semanais
        </button>
      </div>

      {activeSubTab === 'recipes' ? (
        <>
          {/* Se nenhuma receita estiver selecionada, mostra a lista */}
          {!selectedRecipe ? (
            <>
              {/* Barra de Pesquisa e Filtros */}
              <div className="search-wrapper">
                <Search size={20} style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Pesquise por receitas ou ingredientes..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="tab-container" style={{ margin: '16px 0 24px' }}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`tab-btn ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                    style={{ fontSize: '0.8rem', padding: '6px 14px' }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Lista Grid de Receitas */}
              <div className="grid-3">
                {filteredRecipes.map((recipe) => (
                  <div 
                    key={recipe.id} 
                    className="media-card glass glass-hover"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedRecipe(recipe)}
                  >
                    <div 
                      className="media-img" 
                      style={{ backgroundImage: `url(${fruitBackground})` }}
                    >
                      <span className="media-tag">{recipe.category}</span>
                    </div>
                    <div className="media-info">
                      <div>
                        <h4 className="media-title">{recipe.name}</h4>
                        <div style={{ display: 'flex', gap: '12px', fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={12} /> {recipe.prepTime}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Flame size={12} /> {recipe.calories}
                          </span>
                        </div>
                      </div>
                      <button 
                        className="btn btn-secondary btn-sm" 
                        style={{ marginTop: '16px', width: '100%', padding: '8px' }}
                      >
                        Ver Detalhes
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredRecipes.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                  Nenhuma receita encontrada para os filtros selecionados.
                </div>
              )}
            </>
          ) : (
            /* Detalhe da Receita Selecionada */
            <div className="card glass fade-in">
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={() => setSelectedRecipe(null)}
                style={{ marginBottom: '20px' }}
              >
                Voltar à Lista
              </button>

              <div className="grid-2">
                <div 
                  style={{ 
                    borderRadius: 'var(--radius-md)', 
                    height: '300px', 
                    backgroundImage: `url(${fruitBackground})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }} 
                />
                <div>
                  <span style={{ 
                    padding: '4px 12px', 
                    background: 'var(--primary-light)', 
                    color: 'var(--primary)', 
                    fontSize: '0.78rem', 
                    fontWeight: 700, 
                    borderRadius: '50px' 
                  }}>
                    {selectedRecipe.category}
                  </span>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, marginTop: '8px', fontSize: '1.8rem' }}>
                    {selectedRecipe.name}
                  </h2>
                  <div style={{ display: 'flex', gap: '20px', margin: '16px 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <span>Tempo: <strong>{selectedRecipe.prepTime}</strong></span>
                    <span>Calorias: <strong>{selectedRecipe.calories}</strong></span>
                    <span>Dificuldade: <strong>{selectedRecipe.difficulty}</strong></span>
                  </div>

                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>Ingredientes</h3>
                  <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {selectedRecipe.ingredients.map((ing, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                        <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>•</span>
                        {ing}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={{ marginTop: '32px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>Modo de Preparo</h3>
                <ol style={{ paddingLeft: '20px' }}>
                  {selectedRecipe.directions.map((step, idx) => (
                    <li key={idx} style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '10px', lineHeight: '1.6' }}>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Aba de Cardápios Alimentares */
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {!userStats && (
            <div style={{ padding: '16px', background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              💡 <strong>Dica de Personalização:</strong> Vá na aba <strong>Calculadora</strong>, insira seus dados físicos e clique em calcular para personalizar este plano alimentar automaticamente com seu limite de calorias e objetivo real!
            </div>
          )}

          {dynamicPlans.map((plan) => (
            <div key={plan.id} className="card glass">
              <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem' }}>{plan.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{plan.objective}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Alvo Diário</span>
                  <div style={{ fontWeight: 800, color: 'var(--primary)' }}>{plan.caloricTarget}</div>
                </div>
              </div>

              {/* Seletor de Dia da Semana */}
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)' }}>
                {plan.days.map((d) => (
                  <button
                    key={d.day}
                    onClick={() => setActiveDay(d.day)}
                    className="btn btn-secondary btn-sm"
                    style={{
                      whiteSpace: 'nowrap',
                      padding: '8px 16px',
                      fontSize: '0.82rem',
                      background: activeDay === d.day ? 'var(--primary-light)' : 'transparent',
                      color: activeDay === d.day ? 'var(--primary)' : 'var(--text-secondary)',
                      borderColor: activeDay === d.day ? 'var(--primary)' : 'var(--border-color)',
                      fontWeight: 700
                    }}
                  >
                    {d.day}
                  </button>
                ))}
              </div>
 
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {plan.days.filter(d => d.day === activeDay).map((dayPlan, dIdx) => (
                  <div key={dIdx} className="fade-in" style={{ padding: '20px', background: 'rgba(0,0,0,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <h4 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={18} style={{ color: 'var(--primary)' }} />
                      Cardápio de {dayPlan.day}
                    </h4>
                    <div className="grid-2" style={{ gap: '12px' }}>
                      {dayPlan.meals.map((meal, mIdx) => (
                        <div key={mIdx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: 'var(--bg-card)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, background: 'var(--primary-light)', color: 'var(--primary)', padding: '4px 8px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                            {meal.time}
                          </span>
                          <div>
                            <strong style={{ fontSize: '0.88rem', display: 'block', color: 'var(--text-primary)' }}>{meal.name}</strong>
                            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginTop: '4px' }}>{meal.food}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
