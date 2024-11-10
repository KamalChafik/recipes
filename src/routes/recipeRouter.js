import express from 'express';
import { getRandomMeal, getRecipeById } from '../controllers/recipeController.js';

const router = express.Router();

router.get('/', getRandomMeal);
router.get('/:id', getRecipeById);


export default router;
