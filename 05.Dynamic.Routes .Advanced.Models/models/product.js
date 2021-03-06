const fs = require('fs');
const path = require('path');

const Cart = require('./cart');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile(products => {
      if (this.id) {
        const productIndex = products.findIndex(item => item.id === this.id);
        const updatedProducts = [...products];
        updatedProducts[productIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedProducts), err => {
          console.log(err);
        });
      } else {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), err => {
          console.log(err);
        });

      }
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findProduct(id, cb) {
    getProductsFromFile(products => {
      const product = products.find(item => item.id === id);
      cb(product);
    })
  }

  static deleteProduct(id, cb) {
    getProductsFromFile(products => {
      const product = products.find(item => item.id === id);
      const updatedProducts = products.filter(item => item.id !== id);
      console.log(updatedProducts);
      fs.writeFile(p, JSON.stringify(updatedProducts), err => {
        if (!err) {
          Cart.removeProducts(id, product.price);
        }
      });
      cb();
    });
  }
};
