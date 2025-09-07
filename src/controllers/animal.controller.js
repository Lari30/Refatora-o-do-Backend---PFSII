// src/controllers/animal.controller.js
import {
  findAllAnimais,
  findAnimalWithAdotante,
  createAnimalParaAdotante, 
} from '../repositories/animal.repo.js';

export async function getAnimais(req, res) {
  try {
    
    const page  = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 50);
    const data = await findAllAnimais({ page, limit });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Erro interno' });
  }
}

export async function getAnimalById(req, res) {
  try {
    const animal = await findAnimalWithAdotante(req.params.id);
    if (!animal) return res.status(404).json({ message: 'Animal não encontrado' });
    res.json(animal);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Erro interno' });
  }
}

export async function postAnimal(req, res) {
  try {
    const novo = await createAnimalParaAdotante(req.body || {});
    res.status(201).json(novo);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Erro interno' });
  }
}
