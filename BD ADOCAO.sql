CREATE DATABASE IF NOT EXISTS 
adocao CHARACTER SET
utf8mb4 COLLATE
utf8mb4_unicode_ci;

use adocao;

CREATE TABLE adotante (
id INT AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR (120) NOT NULL,
cpf CHAR(11) unique,
email VARCHAR(160) unique,
telefone VARCHAR(30),
criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE animal (
id INT AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(80) NOT NULL,
especie VARCHAR(80) NOT NULL,
raca VARCHAR(80),
sexo ENUM("M","F") NOT NULL,
data_nascimento DATE,
status ENUM('disponível', 'adotado', 'indisponível') NOT NULL DEFAULT 'disponível',
adotante_id INT NULL, 
criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
KEY idx_animal_adotante (adotante_id),
CONSTRAINT fk_animal_adotante
FOREIGN KEY (adotante_id)
REFERENCES adotante (id)
ON UPDATE CASCADE
ON DELETE SET NULL
) ENGINE=InnoDB;

INSERT INTO adotante (nome, cpf, email) VALUES
('Maria Silva', '12345678901', 'maria@ex.com'),
('João Souza', '98765432100', 'joao@ex.com');

INSERT INTO animal (nome, especie, raca, sexo, status, adotante_id) VALUES
('Thor', 'cachorro', 'SRD', 'M', 'adotado', 1),
('Luna', 'gato', 'Siamês', 'F', 'adotado', 1),
('Bidu', 'cachorro', 'Beagle', 'M', 'disponivel', NULL);

SELECT a.id, a.nome AS animal, a.especie, ad.nome AS adotante
FROM animal a
LEFT JOIN adotante ad ON ad.id = a.adotante_id
ORDER BY ad.nome, a.nome;

UPDATE adotante
SET email = 'maria@gmail.com'
WHERE id = 1;

UPDATE adotante
SET email = 'joao@gmail.com'
WHERE id = 2;

UPDATE adotante
SET telefone = '(18) 99706-9138'
WHERE id = 1;

UPDATE adotante
SET telefone = '(18) 99105-3322'
WHERE id = 2;

UPDATE animal
SET data_nascimento = '2022-11-01'
WHERE id = 1;

UPDATE animal
SET data_nascimento = '2025-08-19'
WHERE id = 2;

UPDATE animal
SET data_nascimento = '2024-12-23'
WHERE id = 3;

UPDATE animal
SET raca = 'Golden Retriever'
WHERE id = 1;





