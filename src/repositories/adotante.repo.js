// src/repositories/adotante.repo.js
import pool from '../config/db.js';

// cria novo adotante
export async function createAdotante({ nome, email, telefone }) {
  const [result] = await pool.query(
    'INSERT INTO adotante (nome, email, telefone) VALUES (?, ?, ?)',
    [nome, email, telefone]
  );
  return { id: result.insertId, nome, email, telefone };
}

// busca adotante + seus animais
export async function findAdotanteWithAnimais(id) {
  const [rows] = await pool.query(
    `SELECT 
       ad.id        AS adotante_id,
       ad.nome      AS adotante_nome,
       ad.email     AS adotante_email,
       ad.telefone  AS adotante_telefone,
       an.id        AS animal_id,
       an.nome      AS animal_nome,
       an.especie   AS animal_especie,
       an.raca      AS animal_raca,
       an.sexo      AS animal_sexo,
       an.status    AS animal_status
     FROM adotante ad
     LEFT JOIN animal an ON ad.id = an.adotante_id
     WHERE ad.id = ?`,
    [id]
  );

  if (rows.length === 0) return null;

  return {
    adotante_id: rows[0].adotante_id,
    nome: rows[0].adotante_nome,
    email: rows[0].adotante_email,
    telefone: rows[0].adotante_telefone,
    animais: rows
      .filter(r => r.animal_id !== null)
      .map(r => ({
        id: r.animal_id,
        nome: r.animal_nome,
        especie: r.animal_especie,
        raca: r.animal_raca,
        sexo: r.animal_sexo,
        status: r.animal_status
      }))
  };
}
