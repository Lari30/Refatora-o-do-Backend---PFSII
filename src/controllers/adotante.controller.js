// src/controllers/adotante.controller.js
import { findAdotanteWithAnimais, createAdotante } from '../repositories/adotante.repo.js';

export async function postAdotante(req, res) {
  try {
    const { nome, email = null, telefone = null } = req.body || {};
    if (!nome?.trim()) {
      return res.status(400).json({ message: 'Campo "nome" é obrigatório' });
    }
    const novo = await createAdotante({ nome, email, telefone });
    res.status(201).json(novo);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Erro interno' });
  }
}

export async function getAdotanteWithAnimais(req, res) {
  try {
    const { id } = req.params;
    const adotante = await findAdotanteWithAnimais(id);
    if (!adotante) {
      return res.status(404).json({ message: 'Adotante não encontrado' });
    }
    res.json(adotante);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Erro interno' });
  }
}
