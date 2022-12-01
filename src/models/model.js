const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")   
const { response } = require("express")



const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim: true,
        minLength: 2
    },
    lastname: {
        type: String,
        required: false,
        trim: true,
        minLength: 2
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
        min: [10, '10 char'],
    },
    password: {
        type: String,
        minLength: 5,
        required: true,
    },
    tokens: [{
        token:{
            type:String,
            required: true,
        }
    }]
})

// generating token || middleware
UserSchema.methods.generateAuthToken = async function(){
    try{

        const token = jwt.sign({_id:this.id.toString()}, process.env.SECRET_KEY )
        this.tokens = await this.tokens.concat({token})
        // await this.save()
        console.log(`method- ${token}`);
        return token
    }
    catch(err){
        console.log(err)
        res.send(err)
    }
}



// concept of middleware ||  convert password into hash
UserSchema.pre("save", async function (next) {


    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
        console.log(`the current password is ${this.password}`);
    }

    next()
})



const User = new mongoose.model("User", UserSchema)





module.exports = User