import express from 'express'
import 'dotenv/config';
import animalRouter from './routes/animal.routes.js'
import adotanteRouter from './routes/adotante.routes.js'


const app =express();
app.use(express.json());
app.use('/animal',animalRouter)
app.use('/adotante',adotanteRouter)

export default app;