const jwt = require("jsonwebtoken")
const user = require("../models/model")



const auth = async(req, res, next) => {
    try {
        const token =  req.cookies.jwt
        console.log("hellos");
        const verifyUser =  jwt.verify(token, process.env.SECRET_KEY)
        console.log(verifyUser)
        
        const userDetatil = await user.findOne({_id:verifyUser._id})
        // console.log({userDetatil})
        console.log("heree")
        
        req.token = token
        req.userDetatil = userDetatil

        next()
    } catch (error) {
        res.status(401).send("Please login first to navigate this page")
    }
}


module.exports = auth