module.exports = (req,res,next) =>{
    if(!req.seesion.isLogedIn){
        return res.seesion('/login')
    }
    next()
}