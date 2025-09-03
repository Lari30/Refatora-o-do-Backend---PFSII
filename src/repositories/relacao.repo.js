
import pool from '../config/db.js';



export async function listRelacoes({ animalId = null, adotanteId = null } = {}) {
  const params = [];
  let where = '1=1';
  if (animalId) { where += ' AND r.animal_id = ?'; params.push(animalId); }
  if (adotanteId) { where += ' AND r.adotante_id = ?'; params.push(adotanteId); }

  const [rows] = await pool.query(
    `SELECT r.id, r.status_relacao, r.criado_em, r.atualizado_em,
            a.id AS animal_id, a.nome AS animal_nome,
            ad.id AS adotante_id, ad.nome AS adotante_nome
     FROM animal_adotante r
     JOIN animal a    ON a.id = r.animal_id
     JOIN adotante ad ON ad.id = r.adotante_id
     WHERE ${where}
     ORDER BY r.id DESC`,
    params
  );
  return rows;
}

export async function createRelacao({ animal_id, adotante_id, status_relacao = 'Interessado' }) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    
    const [[a]] = await conn.query('SELECT id FROM animal WHERE id = ?', [animal_id]);
    const [[ad]] = await conn.query('SELECT id FROM adotante WHERE id = ?', [adotante_id]);
    if (!a) { const e = new Error('animal_id não encontrado'); e.status = 400; throw e; }
    if (!ad) { const e = new Error('adotante_id não encontrado'); e.status = 400; throw e; }

   
    const [dup] = await conn.query(
      'SELECT id FROM animal_adotante WHERE animal_id=? AND adotante_id=?',
      [animal_id, adotante_id]
    );
    if (dup.length) { const e = new Error('Relação já existe para este animal/adotante'); e.status = 409; throw e; }

    const [ins] = await conn.query(
      `INSERT INTO animal_adotante (animal_id, adotante_id, status_relacao)
       VALUES (?, ?, ?)`,
      [animal_id, adotante_id, status_relacao]
    );

    const [[row]] = await conn.query(
      `SELECT id, animal_id, adotante_id, status_relacao, criado_em, atualizado_em
       FROM animal_adotante WHERE id = ?`, [ins.insertId]
    );
    await conn.commit();
    return row;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

export async function updateRelacao(id, { status_relacao }) {
  const [res] = await pool.query(
    `UPDATE animal_adotante SET status_relacao = ?, atualizado_em = CURRENT_TIMESTAMP
     WHERE id = ?`, [status_relacao, id]
  );
  if (res.affectedRows === 0) {
    const e = new Error('Relação não encontrada'); e.status = 404; throw e;
  }
  const [[row]] = await pool.query(
    `SELECT id, animal_id, adotante_id, status_relacao, criado_em, atualizado_em
     FROM animal_adotante WHERE id = ?`, [id]
  );
  return row;
}

export async function deleteRelacao(id) {
  const [res] = await pool.query('DELETE FROM animal_adotante WHERE id = ?', [id]);
  if (res.affectedRows === 0) {
    const e = new Error('Relação não encontrada'); e.status = 404; throw e;
  }
  return { ok: true };
}
