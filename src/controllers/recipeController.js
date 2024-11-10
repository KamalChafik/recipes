export const getRandomMeal = async (req, res) => {
    try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
        const data = await response.json();
        const meal = data.meals[0];
        res.render('recipe', { meal });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.send('Error fetching data');
    }
};
