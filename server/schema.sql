-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    goal VARCHAR(50) DEFAULT 'Saúde Geral',
    gender VARCHAR(20) DEFAULT 'female',
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Histórico de Peso
CREATE TABLE IF NOT EXISTS weight_history (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    weight NUMERIC(5,2) NOT NULL,
    height NUMERIC(5,2) NOT NULL,
    imc NUMERIC(4,1) NOT NULL,
    log_date VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Controle de Água
CREATE TABLE IF NOT EXISTS water_logs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    cups INT DEFAULT 0,
    log_date DATE UNIQUE DEFAULT CURRENT_DATE
);

-- Tabela de Receitas Customizadas (Admin)
CREATE TABLE IF NOT EXISTS custom_recipes (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    prep_time VARCHAR(20) NOT NULL,
    calories VARCHAR(20) NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    ingredients TEXT[] NOT NULL,
    directions TEXT[] NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Exercícios Customizados (Admin)
CREATE TABLE IF NOT EXISTS custom_exercises (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    target VARCHAR(100) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    instructions TEXT[] NOT NULL,
    image_url TEXT,
    burn_rate VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Desafios Customizados (Admin)
CREATE TABLE IF NOT EXISTS custom_challenges (
    id SERIAL PRIMARY KEY,
    level VARCHAR(20) NOT NULL, -- 'leve', 'moderado', 'pesado'
    day INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    detail TEXT NOT NULL,
    warning TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_level_day UNIQUE(level, day)
);

-- Inserir usuário administrador padrão se não existir
INSERT INTO users (name, email, password, goal, gender, is_admin)
VALUES ('Administrador CSN', 'nogueiralfha@gmail.com', 'missionario405', 'Administração Geral', 'male', TRUE)
ON CONFLICT (email) DO NOTHING;
