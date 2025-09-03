
import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();



router.post('/auth/login', (req, res) => {
  const { usuario, senha } = req.body || {};
  const USER = process.env.AUTH_USER || 'aluno';
  const PASS = process.env.AUTH_PASS || 'senha123';

  if (usuario === USER && senha === PASS) {
    const payload = { sub: usuario, perfil: 'aluno' };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'segredo-super-simples', {
      expiresIn: '2h',
      issuer: 'api-adocao'
    });
    return res.json({ ok: true, token });
  }
  return res.status(401).json({ ok: false, erro: 'Credenciais inválidas' });
});

export default router;
