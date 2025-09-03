import 'dotenv/config';
import express from 'express';
import adotanteRoutes from './routes/adotante.routes.js';
import animalRoutes from './routes/animal.routes.js';
import authRoutes from './routes/auth.routes.js';
import relacaoRoutes from './routes/relacao.routes.js';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => res.send('ok'));

app.get('/', (_req, res) => {
  res.send('API no ar! Use /api/... ou crie um index.html em /public');
});


app.use('/api', authRoutes);


app.use('/api', adotanteRoutes);
app.use('/api', animalRoutes);


app.use('/api', relacaoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
