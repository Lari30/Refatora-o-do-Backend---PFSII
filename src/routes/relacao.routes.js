
import { Router } from 'express';
import { autenticarJWT } from '../middlewares/auth.js';
import { getRelacoes, postRelacao, putRelacao, deleteRelacaoCtrl } from '../controllers/relacao.controller.js';

const router = Router();


router.get('/relacoes', autenticarJWT, getRelacoes);
router.post('/relacoes', autenticarJWT, postRelacao);
router.put('/relacoes/:id', autenticarJWT, putRelacao);
router.delete('/relacoes/:id', autenticarJWT, deleteRelacaoCtrl);

export default router;
