-- Banco de dados MySQL simples para sistema de login (sem ligação com PHP)
-- Para executar: mysql -u root -p < banco_login.sql

DROP DATABASE IF EXISTS sistema_login;
CREATE DATABASE sistema_login CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sistema_login;

-- Tabela de usuários
-- A senha NUNCA é guardada em texto puro: só o hash.
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    perfil ENUM('admin', 'usuario') NOT NULL DEFAULT 'usuario',
    ativo TINYINT(1) NOT NULL DEFAULT 1,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_login TIMESTAMP NULL
);

-- Registro de tentativas de login (útil para segurança)
CREATE TABLE tentativas_login (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) NOT NULL,
    sucesso TINYINT(1) NOT NULL,
    data_tentativa TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX (usuario, data_tentativa)
);

-- Usuários de exemplo
-- ATENÇÃO: hash SHA-256 apenas para demonstração (senhas: admin123 e user123).
-- Em um sistema real, gere o hash na aplicação com bcrypt ou argon2.
INSERT INTO usuarios (nome, email, usuario, senha_hash, perfil) VALUES
    ('Administrador', 'admin@email.com', 'admin', SHA2('admin123', 256), 'admin'),
    ('Maria Silva', 'maria@email.com', 'maria', SHA2('user123', 256), 'usuario');

-- Exemplo de verificação de login (retorna 1 linha se usuário e senha estiverem corretos)
SELECT id, nome, perfil
FROM usuarios
WHERE usuario = 'admin'
  AND senha_hash = SHA2('admin123', 256)
  AND ativo = 1;

-- Exemplo: registrar o último login
UPDATE usuarios SET ultimo_login = NOW() WHERE usuario = 'admin';

-- Exemplo: registrar uma tentativa de login
INSERT INTO tentativas_login (usuario, sucesso) VALUES ('admin', 1);
