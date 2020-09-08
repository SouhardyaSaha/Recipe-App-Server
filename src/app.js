const express = require('express');
const cors = require('cors');
require('./db/mongoose');
const userRouter = require('./routes/user'); 
const recipeRouter = require('./routes/recipe');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors())

app.use(express.json());
app.use(userRouter);
app.use(recipeRouter);

app.listen(port, () => {
    console.log(`Server Running on port ${port}`);
});
