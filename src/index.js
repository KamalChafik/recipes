import express from 'express';
import path from 'path';
import recipeRouter from './routes/recipeRouter.js';

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'src', 'views'));
app.use(express.static('public'));

// Welcome route at "/"
app.get('/', (req, res) => {
    res.send('Welcome to the Recipe App!');
});

// Use recipe routes under "/recipe"
app.use('/recipe', recipeRouter);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`[server]: Server is running on http://localhost:${PORT}`);
});
