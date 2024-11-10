// Base URL for MealDB API
const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

// Helper function to make GET requests
const fetchData = async (url) => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error('Error fetching data');
    }
};

export const getRandomMeal = async (req, res) => {
    console.log(`[server]: GET /recipe`)
    try {
        const response = await fetchData(`${BASE_URL}/random.php`);
        const meal = response.meals[0];

        // Split instructions into individual steps (found that they have \r in json)
        const instructions = meal.strInstructions.split('\r\n').filter(step => step.trim() !== "");

        res.render('recipe', { meal, instructions });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.send('Error fetching data');
    }
};

// Get Recipe by ID
export const getRecipeById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`[server]: GET /recipe/${id}`)
        const response = await fetchData(`${BASE_URL}/lookup.php?i=${id}`);
        console.log(response)
        const meal = response.meals[0];

        if (meal) {
            // Split instructions into individual steps (found that they have \r in json)
            const instructions = meal.strInstructions.split('\r\n').filter(step => step.trim() !== "");

            res.render('recipe', { meal, instructions });
        } else {
            res.status(404).send('Recipe not found');
        }
    } catch (error) {
        res.status(500).send('Error fetching recipe data');
    }
};