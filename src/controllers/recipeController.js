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

// Get Recipe List with optional filters
export const getRecipeList = async (req, res) => {
    console.log(`[server]: GET /recipe/list`)
    try {
        const { category, area, name } = req.query;
        let recipes = [];

        // Fetch categories and areas for dropdowns
        const [categoriesResponse, areasResponse] = await Promise.all([
            fetchData(`${BASE_URL}/list.php?c=list`),
            fetchData(`${BASE_URL}/list.php?a=list`)
        ]);
        const categories = categoriesResponse.meals.map(meal => meal.strCategory);
        const areas = areasResponse.meals.map(meal => meal.strArea);

        // Fetch data for each filter if it exists
        const fetchPromises = [];
        if (name) {
            fetchPromises.push(fetchData(`${BASE_URL}/search.php?s=${name}`));
        }
        if (category) {
            fetchPromises.push(fetchData(`${BASE_URL}/filter.php?c=${category}`));
        }
        if (area) {
            fetchPromises.push(fetchData(`${BASE_URL}/filter.php?a=${area}`));
        }

        // gotta get them all
        if (fetchPromises.length > 0) {
            const results = await Promise.all(fetchPromises);

            // fun croos referencing...
            recipes = results[0].meals || [];
            for (let i = 1; i < results.length; i++) {
                const meals = results[i].meals || [];
                recipes = recipes.filter(meal => meals.some(filteredMeal => filteredMeal.idMeal === meal.idMeal));
            }
        }

        res.render('list', { recipes, categories, countries: areas });
    } catch (error) {
        res.status(500).send('Error fetching recipe list');
    }
};
