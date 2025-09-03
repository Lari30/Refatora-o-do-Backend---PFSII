
import pool from '../config/db.js';

export async function findAllAnimais({ page = 1, limit = 50 } = {}) {
  const offset = (page - 1) * limit;
  const [rows] = await pool.query(
    `SELECT a.id, a.nome, a.especie, a.raca, a.sexo, a.status,
            ad.id AS adotante_id, ad.nome AS adotante_nome
     FROM animal a
     LEFT JOIN adotante ad ON ad.id = a.adotante_id
     ORDER BY a.id
     LIMIT ? OFFSET ?`,
    [limit, offset]
  );
  return rows;
}

export async function findAnimalWithAdotante(id) {
  const [rows] = await pool.query(
    `SELECT a.id, a.nome AS animal_nome, a.especie, a.raca, a.sexo, a.status,
            ad.id AS adotante_id, ad.nome AS adotante_nome
     FROM animal a
     LEFT JOIN adotante ad ON ad.id = a.adotante_id
     WHERE a.id = ?`,
    [id]
  );
  if (!rows.length) return null;
  const r = rows[0];
  return {
    id: r.id,
    nome: r.animal_nome,
    especie: r.especie,
    raca: r.raca,
    sexo: r.sexo,
    status: r.status,
    adotante: r.adotante_id ? { id: r.adotante_id, nome: r.adotante_nome } : null
  };
}

export async function createAnimalParaAdotante({
  adotante_id, nome, especie, raca = null, sexo = 'M', status = 'adotado'
}) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    if (!adotante_id) { const e = new Error("Campo 'adotante_id' é obrigatório"); e.status = 400; throw e; }
    if (!nome?.trim()) { const e = new Error("Campo 'nome' é obrigatório"); e.status = 400; throw e; }
    if (!especie?.trim()) { const e = new Error("Campo 'especie' é obrigatório"); e.status = 400; throw e; }
    if (!['M','F'].includes(sexo)) { const e = new Error("Campo 'sexo' inválido (use 'M' ou 'F')"); e.status = 400; throw e; }

    
    const validStatus = ['disponível','adotado','indisponível'];
    if (!validStatus.includes(status)) {
      const e = new Error(`Campo 'status' inválido (use: ${validStatus.join(', ')})`);
      e.status = 400; throw e;
    }

    const [[ad]] = await conn.query('SELECT id FROM adotante WHERE id = ?', [adotante_id]);
    if (!ad) { const e = new Error('Adotante não encontrado'); e.status = 400; throw e; }

    const [ins] = await conn.query(
      `INSERT INTO animal (nome, especie, raca, sexo, status, adotante_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nome, especie, raca, sexo, status, adotante_id]
    );

    const [rows] = await conn.query(
      `SELECT a.id, a.nome, a.especie, a.raca, a.sexo, a.status,
              ad.id AS adotante_id, ad.nome AS adotante_nome
         FROM animal a
         JOIN adotante ad ON ad.id = a.adotante_id
        WHERE a.id = ?`,
      [ins.insertId]
    );

    await conn.commit();
    return rows[0];
  } catch (err) {
    await conn.rollback();
    if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.errno === 1452) {
      err.status = 400; err.message = 'FK inválida: adotante_id não existe';
    }
    throw err;
  } finally {
    conn.release();
  }
}
