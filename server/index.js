const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Configuração de conexão do Neon PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Requerido para conexão segura no Neon
  }
});

// Inicialização automática das tabelas do banco de dados
const initDb = async () => {
  try {
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await pool.query(schemaSql);
    console.log('✓ Neon PostgreSQL: Tabelas inicializadas com sucesso.');
  } catch (err) {
    console.error('Erro ao inicializar tabelas no Neon:', err);
  }
};

pool.on('connect', () => {
  console.log('Conectado ao Neon PostgreSQL');
});

// Endpoint de Teste de Conexão
app.get('/api/health', (req, res) => {
  res.json({ status: 'online', database: 'connected', service: 'C.S.N API' });
});

// 1. LOGIN
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Usuário não encontrado.' });
    }
    const user = result.rows[0];
    if (user.password !== password) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      goal: user.goal,
      gender: user.gender,
      isAdmin: user.is_admin
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro no servidor.', details: err.message });
  }
});

// 2. CADASTRO
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, goal, gender } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (name, email, password, goal, gender) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, goal, gender, is_admin',
      [name, email, password, goal || 'Saúde Geral', gender || 'female']
    );
    res.status(201).json({
      id: result.rows[0].id,
      name: result.rows[0].name,
      email: result.rows[0].email,
      goal: result.rows[0].goal,
      gender: result.rows[0].gender,
      isAdmin: result.rows[0].is_admin
    });
  } catch (err) {
    if (err.code === '23505') {
      res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
    } else {
      res.status(500).json({ error: 'Erro ao cadastrar.', details: err.message });
    }
  }
});

// 3. ATUALIZAR METAS E DADOS CORPORAIS (USUÁRIO)
app.post('/api/user/stats', async (req, res) => {
  const { userId, weight, height, imc, goal, gender } = req.body;
  try {
    // Atualiza tabela de usuários
    await pool.query(
      'UPDATE users SET goal = $1, gender = $2 WHERE id = $3',
      [goal, gender, userId]
    );

    // Registra histórico de peso
    const logDate = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    await pool.query(
      'INSERT INTO weight_history (user_id, weight, height, imc, log_date) VALUES ($1, $2, $3, $4, $5)',
      [userId, weight, height, imc, logDate]
    );

    res.json({ success: true, message: 'Dados e histórico atualizados!' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar dados.', details: err.message });
  }
});

// 4. OBTER HISTÓRICO DE PESO
app.get('/api/user/history/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      'SELECT weight, height, imc, log_date as date FROM weight_history WHERE user_id = $1 ORDER BY id ASC',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao obter histórico.', details: err.message });
  }
});

// 5. ATUALIZAR CONTROLE DE ÁGUA
app.post('/api/user/water', async (req, res) => {
  const { userId, cups } = req.body;
  try {
    await pool.query(
      'INSERT INTO water_logs (user_id, cups) VALUES ($1, $2) ON CONFLICT (log_date) DO UPDATE SET cups = $2',
      [userId, cups]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar consumo de água.', details: err.message });
  }
});

// 6. PEGAR MATERIAIS ADICIONAIS (RECEITAS, EXERCÍCIOS, DESAFIOS)
app.get('/api/materials/recipes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM custom_recipes ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar receitas.', details: err.message });
  }
});

app.post('/api/admin/recipes', async (req, res) => {
  const { id, name, category, prepTime, calories, difficulty, ingredients, directions } = req.body;
  try {
    await pool.query(
      'INSERT INTO custom_recipes (id, name, category, prep_time, calories, difficulty, ingredients, directions) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [id, name, category, prepTime, calories, difficulty, ingredients, directions]
    );
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar receita.', details: err.message });
  }
});

app.delete('/api/admin/recipes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM custom_recipes WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir.', details: err.message });
  }
});

// Exercícios
app.get('/api/materials/exercises', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM custom_exercises ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar exercícios.', details: err.message });
  }
});

app.post('/api/admin/exercises', async (req, res) => {
  const { id, name, category, target, duration, difficulty, description, instructions, burnRate } = req.body;
  try {
    await pool.query(
      'INSERT INTO custom_exercises (id, name, category, target, duration, difficulty, description, instructions, burn_rate) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      [id, name, category, target, duration, difficulty, description, instructions, burnRate]
    );
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar exercício.', details: err.message });
  }
});

app.delete('/api/admin/exercises/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM custom_exercises WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir.', details: err.message });
  }
});

// Desafios
app.get('/api/materials/challenges', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM custom_challenges ORDER BY day ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar desafios.', details: err.message });
  }
});

app.post('/api/admin/challenges', async (req, res) => {
  const { level, day, title, detail, warning } = req.body;
  try {
    await pool.query(
      'INSERT INTO custom_challenges (level, day, title, detail, warning) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (level, day) DO UPDATE SET title = $3, detail = $4, warning = $5',
      [level, day, title, detail, warning]
    );
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar desafio.', details: err.message });
  }
});

app.delete('/api/admin/challenges/:level/:day', async (req, res) => {
  const { level, day } = req.params;
  try {
    await pool.query('DELETE FROM custom_challenges WHERE level = $1 AND day = $2', [level, parseInt(day)]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir desafio.', details: err.message });
  }
});

// Iniciar servidor e DB
app.listen(port, async () => {
  console.log(`Servidor rodando na porta ${port}`);
  await initDb();
});
