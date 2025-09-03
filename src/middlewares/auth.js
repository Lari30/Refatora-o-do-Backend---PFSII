
import jwt from 'jsonwebtoken';


export function autenticarJWT(req, res, next) {
  const auth = req.headers['authorization'] || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) {
    return res.status(401).json({ erro: 'Token não enviado' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'segredo-super-simples';
    const payload = jwt.verify(token, secret);
    req.usuario = payload; 
    next();
  } catch (e) {
    return res.status(401).json({ erro: 'Token inválido ou expirado' });
  }
}
