var mongoose = require('mongoose');

mongoose.model('Product', new mongoose.Schema({
    product_id: [Number],
    name: String,
    stock: [Number],
    create_date: { type: Date },
}))