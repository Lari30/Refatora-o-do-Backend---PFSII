import pool from '../config/db.js';

export async function findAdotanteWithAnimais(id) {
  const [rows] = await pool.query(
    `SELECT ad.id AS adotante_id, ad.nome AS adotante_nome,
            an.id AS animal_id, an.nome AS animal_nome, an.especie
     FROM adotante ad
     LEFT JOIN animal an ON ad.id = an.adotante_id
     WHERE ad.id = ?`,
    [id]
  );
  return rows;
}

export async function createAdotante({ nome, email = null, telefone = null }) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    if (!nome?.trim()) { const e = new Error("Campo 'nome' é obrigatório"); e.status = 400; throw e; }

    
    if (email) {
      const [dupes] = await conn.query('SELECT id FROM adotante WHERE email = ?', [email]);
      if (dupes.length) { const e = new Error('E-mail já cadastrado'); e.status = 409; throw e; }
    }

    const [ins] = await conn.query(
      'INSERT INTO adotante (nome, email, telefone) VALUES (?, ?, ?)',
      [nome, email, telefone]
    );

    const [rows] = await conn.query(
      'SELECT id, nome, email, telefone FROM adotante WHERE id = ?',
      [ins.insertId]
    );

    await conn.commit();
    return rows[0];
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}
