const express = require('express');
const Recipe = require('../models/recipe');
const auth = require('../middlewares/auth')

const router = express.Router();

// create recipe
router.post('/recipes', async (req, res) => {

    const recipe = new Recipe(req.body);
    try {
        await recipe.save();
        res.status(201).send(recipe);
    } catch (error) {
        res.status(500).send(error);
    }

})


// get all recipes
router.get('/recipes', auth, async (req, res) => {

    const sort = {};
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;  // -1 for descending data and 1 for asc
    }

    try {
        const recipes = await Recipe.find({}, ['-ingredients'], {
            limit: parseInt(req.query.limit), // if limit is undefined then it will be ignored automatically
            skip: parseInt(req.query.skip),
            sort
        });

        res.send(recipes);

    } catch (error) {
        res.status(500).send(error);
    }

});

// get recipe by id
router.get('/recipes/:id', auth, async (req, res) => {

    const _id = req.params.id;
    try {
        const recipe = await Recipe.findById(_id);
        if (!recipe) {
            return res.status(404).send({ error: 'Not Found!' });
        }

        res.send(recipe);

    } catch (error) {
        res.status(500).send(error);
    }

});

router.patch('/recipes/:id', async (req, res) => {

    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'description', 'imagePath', 'ingredients'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Update Request!' });
    }

    try {

        const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        res.send(recipe);

    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/recipes/:id', async (req, res) => {

    try {
        const recipe = await Recipe.findOneAndDelete({ _id: req.params.id });
        if (!recipe) {
            return res.status(404).send();
        }

        res.send(recipe);
    } catch (error) {
        res.status(500).send();
    }

});

module.exports = router;