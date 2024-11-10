import express from 'express';
import { getRandomMeal, getRecipeById, getRecipeList } from '../controllers/recipeController.js';

const router = express.Router();

router.get('/', getRandomMeal);
router.get('/list', getRecipeList);
router.get('/:id', getRecipeById);


export default router;
