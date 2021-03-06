const fs = require('fs');
const path = require('path');

const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');

const getProductsFromFile = cb => {
    fs.readFile(p, (err, file) => {
        if (err) {
            return cb([]);
        }
        cb(JSON.parse(file));
    });
}

module.exports = class Product {

    constructor(product) {
        this.title = product.title;
        this.imgURL = product.imgURL;
        this.price = product.price;
        this.description = product.description;
    }
    save() {
        getProductsFromFile(products => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), err => console.log(err));
        })
    }
    static fetchAll(cb) {
        getProductsFromFile(cb);
    }
}