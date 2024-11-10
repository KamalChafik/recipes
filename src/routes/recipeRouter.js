import express from 'express';
import { getRandomMeal } from '../controllers/recipeController.js';

const router = express.Router();

router.get('/', getRandomMeal);

export default router;
