const mongodb = require('mongodb');
const Cart = require('./cart');
const db = require("../util/databse");

const getDB = require("../util/databse").getDB


module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }
  save() {
    const db = getDB();
    let dbOp;
    if (this._id) {
      // Update the product
      dbOp = db.collection('products').updateOne({ _id: this._id }, { $set: this });
    } else {
      // Insert the product
      dbOp = db.collection('products').insertOne(this);
    }
    return dbOp
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
  }
  static fetchAll(){
    const db = getDB();
    return db.collection("products").find()
    .toArray()
    .then(products =>{
      console.log(products);
      return products
    })
    .catch(err =>{console.log(err)});
  }

  static findById(prodId){
    const db = getDB();
    return db.collection("products").find({_id: new mongodb.ObjectId (prodId)}).next().then(product =>{
      console.log(product);
      return product
    })
    .catch(err =>{console.log(err)})
  }
 static deleteById(prodId){
  const db = getDB();
  return db.collection('products').delteOne({_id: new mongodb.ObjectId(prodId)})
 }
}