const getDB = require('../util/databse').getDB
const mongodb = require('mongodb')
const ObjectId = mongodb.ObjectId;
class User{
    constructor(username,email){
        this.name = username,
        this.email = email
    }
    save(){
        const db = getDB();
       return db.collection('users').insertOne(this)

    }
    static findById(userId){
        const db = getDB();
        return db.collection('users').findOne({_id: new ObjectId(userId) })
    }
}
module.exports = User