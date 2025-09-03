
import { listRelacoes, createRelacao, updateRelacao, deleteRelacao } from '../repositories/relacao.repo.js';

export async function getRelacoes(req, res) {
  try {
    const { animalId, adotanteId } = req.query;
    const rows = await listRelacoes({ animalId, adotanteId });
    res.json(rows);
  } catch (e) {
    res.status(e.status || 500).json({ erro: e.message || 'Erro ao buscar relações' });
  }
}

export async function postRelacao(req, res) {
  try {
    const { animal_id, adotante_id, status_relacao } = req.body || {};
    if (!animal_id || !adotante_id) {
      return res.status(400).json({ erro: 'Campos animal_id e adotante_id são obrigatórios' });
    }
    const row = await createRelacao({ animal_id, adotante_id, status_relacao });
    res.status(201).json(row);
  } catch (e) {
    res.status(e.status || 500).json({ erro: e.message || 'Erro ao criar relação' });
  }
}

export async function putRelacao(req, res) {
  try {
    const id = Number(req.params.id);
    const { status_relacao } = req.body || {};
    if (!status_relacao) return res.status(400).json({ erro: 'status_relacao é obrigatório' });
    const row = await updateRelacao(id, { status_relacao });
    res.json(row);
  } catch (e) {
    res.status(e.status || 500).json({ erro: e.message || 'Erro ao atualizar relação' });
  }
}

export async function deleteRelacaoCtrl(req, res) {
  try {
    const id = Number(req.params.id);
    const r = await deleteRelacao(id);
    res.json(r);
  } catch (e) {
    res.status(e.status || 500).json({ erro: e.message || 'Erro ao excluir relação' });
  }
}
