const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
}, {
    _id: false
})

const recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    imagePath: {
        type: String,
        trim: true,
        default: 'https://thumbs.dreamstime.com/b/no-image-available-icon-photo-camera-flat-vector-illustration-132483296.jpg'
    },
    ingredients: {
        type: [ingredientSchema],
        default: []
    },
    
    // owner: {
    //     type: mongoose.SchemaTypes.ObjectId,
    //     ref: 'User',
    //     required: true

    // }
}, {
    timestamps: true
});

recipeSchema.pre('save', function (next) {

    next();
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;