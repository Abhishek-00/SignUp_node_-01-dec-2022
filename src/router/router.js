require("dotenv").config()
const user = require("../models/model")
const express = require("express")
const app = express()
const bcrypt = require("bcryptjs")
const hbs = require("hbs")
const cookieParser = require("cookie-parser")






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
app.use(cookieParser())


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




            /*
                cookie

                The res.cookie() function is used to set the cookie name to value.
                The value parameter may be string or object converted to JSON.

            */

            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 300000),
                httpOnly: true                /* no other client can delete cookie  */
            })



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
        console.log(` Token during login - ${token}`);


        if (isMatchPsd) {                  /*    also userEmail.password === password */

            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 300000),
                httpOnly: true,                /*    no other client can delete cookie   */
                // secure:true                 /*    used in production version          */
            })

            res.status(201).render("signUp")
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