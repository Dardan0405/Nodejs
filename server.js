
//To Create a new file with name hi.txt and the string Hi from node 
// const fs = require("fs") = To import the Library FILESTSYTEM
// fs.writeFileSync("hi.txt","Hi from Node")


const http = require("http")
const routes = require("./routes")
// const fs = require('fs')
//req stand for request 
//res stand for response
const server = http.createServer(routes)
    // console.log(req.url, req.method, req.headers)
    // const method = req.method
    // const url = req.url
    
   

server.listen(3002) //Server.listen start the server on localhost 3000 or if we call different number it start the server on that number