
const fs = require("fs")

const requestHandler = ( req,res) =>{
    const url = req.url;
    const method = req.method
    if(url === '/'){//Here when user will visit ex Localhost:3000/ it will show the form
        res.write("<html>")
        res.write("<body>")
        res.write("<h1>Enter Data</h1>")
        res.write("<form action='/message' method='POST'><input type ='text' name='email'> <button type='submit'>Submit data</button></form>")//the action will redirect us to message as sson as the user click on button.
         //Get Request is automatikally sent when you clicjk a link or enter URL, POST Request has to be set up by you by creating such a form.E.x here the post request send to /message 
        res.write("</body>")
        res.write("</html>") 
        return res.end()//This that end after all the response is completed and after that we don't add res.write or something else cause the line after this willbe error cause we ended 
    }
    if(url === '/message' && method ==='POST'){
        const body = [];
        req.on('data', (chunk) =>{
            console.log(chunk)
          body.push(chunk); //We add elements on the array
        })//On allows to listen to certain events
        req.on("end",() =>{
            const parseBody = Buffer.concat(body).toString();//This will create a new buffer and add all the chunks from inside my body to it
            const message = parseBody.split('=')[1];
            fs.writeFile("message.text", message, (err) =>{
                res.statusCode = 302;
                // res.setHeader('Location', '/' ) 
                return res.end()//end is ending or server after the on request data is completed
            } )//Sync = synchronous this is a sepcial method with this we will block actually code execution until the file message is created is better with writeFile cause this don't bllock the code
           
    
        })
       
       
    }
    res.setHeader('Content-Type', 'text/html') //This allow us to set a Header ex Content-Type which is default Header text/html is type of the response is HTML
    res.write("<html>")
    res.write("<body>")
    res.write("<h1>Hi Node!</h1>")
    res.write("</body>")
    res.write("</html>") //This allows us to write some data to the response
    
     // process.exit() This Process.exit quit Server so in code we never call process.exit cause it quit from server
}
module.exports = requestHandler
