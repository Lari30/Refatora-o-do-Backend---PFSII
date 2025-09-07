import 'dotenv/config';
import express from 'express';
import adotanteRoutes from './routes/adotante.routes.js';
import animalRoutes from './routes/animal.routes.js';

const app = express();
app.use(express.json());

//app.post('/_ping', (req, res) => res.json({ ok: true, body: req.body }));
app.get('/health', (_req, res) => res.send('ok'));

app.get('/', (_req, res) => {
  res.send('API no ar! Use /api/... ');
});


app.use('/api',adotanteRoutes);
app.use('/api',animalRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
