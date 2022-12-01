require("dotenv").config()
const user = require("../models/model")
const express = require("express")
const app = express()
const bcrypt = require("bcryptjs")
const { create } = require("hbs")






// app.use(express.json())


const hashPwd = async (password) => {
    console.log(password);
    const hashedPwd = await bcrypt.hash(password, 10)
    console.log(hashedPwd);

    const pwdMatch = await bcrypt.compare(password, hashedPwd)

    return { hashedPwd, pwdMatch }
}



const router = new express.Router(user)         /*  Creating a new router */


app.use(express.json())
app.use(express.urlencoded({ extended: false }))


router.post("/registerUser", async (req, res) => {
    try {
        const pswd = req.body.password
        const cpswd = req.body.confirmpassword

        if (pswd === cpswd) {
            console.log({ pswd, cpswd });
            // const {newPassword, isMatchPwd} = hashPwd(cpswd)   /* to get hashed/matched password*/

            const newUser = new user({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                phone: req.body.phone,
                password: cpswd
            })

            console.log(`created user- ${newUser}`);

            // generate token
            const token = await newUser.generateAuthToken()

            console.log(`token:  ${token}`);

            const createUser = await newUser.save()
            res.status(201).render("signUp")
        }
        else {
            res.send("password are not matching")
        }

    }
    catch (err) {
        res.status(400).send(err)
    }
})



// for login the user
router.post("/login", async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password

        const userEmail = await user.findOne({ email })


        const isMatchPsd = await bcrypt.compare(password, userEmail.password)


        // generate token
        const token = await userEmail.generateAuthToken()
        console.log(`token - ${token}`);

        if (isMatchPsd) {              /*also userEmail.password === password */
           
            res.status(201).render("signUp")
            console.log(userEmail.lastname);
        }
        else {
            res.send("Invalid login details")
        }
    }
    catch (err) {
        console.log(err);
    }
})



module.exports = router