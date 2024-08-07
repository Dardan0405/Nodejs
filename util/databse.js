const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
let _db ;
const MongoConnect =(callback) =>{
    MongoClient.connect('mongodb+srv://dardan:dardan@cluster0.6yiwy8g.mongodb.net/shop?retryWrites=true&w=majority&appName=cluster0')
.then(client =>{
    console.log("Connected!");
    _db = client.db()
    callback()
})
.catch(err =>{
    console.log(err)
    throw err;
});
}
const getDb =() =>{
    if(_db){
        return _db;
    }
    throw 'NO DB found!'
}
exports.MongoConnect = MongoConnect;
exports.getDB = getDb