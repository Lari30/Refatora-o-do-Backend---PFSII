import { Router } from 'express';
import { getAnimais, getAnimalById, postAnimal} from '../controllers/animal.controller.js';

const router = Router();

router.get('/animais', getAnimais);
router.get('/animais/:id', getAnimalById);
router.post('/animais', postAnimal);

export default router;
