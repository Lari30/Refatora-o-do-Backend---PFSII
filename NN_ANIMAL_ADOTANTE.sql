-- Criação da tabela de junção N:N entre animal e adotante
USE adocao;

CREATE TABLE IF NOT EXISTS animal_adotante (
  id INT AUTO_INCREMENT PRIMARY KEY,
  animal_id INT NOT NULL,
  adotante_id INT NOT NULL,
  status_relacao ENUM('Interessado','Em_Visita','Aprovado','Adotado','Recusado') DEFAULT 'Interessado',
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_rel_animal   FOREIGN KEY (animal_id)   REFERENCES animal(id)   ON DELETE CASCADE,
  CONSTRAINT fk_rel_adotante FOREIGN KEY (adotante_id) REFERENCES adotante(id) ON DELETE CASCADE,
  CONSTRAINT uq_animal_adotante UNIQUE (animal_id, adotante_id)
) ENGINE=InnoDB;
