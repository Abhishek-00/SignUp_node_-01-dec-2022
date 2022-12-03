const express = require("express")
const app = express()
const hbs = require("hbs")
const path = require("path")
require("./db/db")                         /* connection to database */
const user = require("./models/model")
const userRouter = require("./router/router")
const auth = require("./middleware/auth")
const cookieParser = require("cookie-parser")
const port = process.env.PORT || 3000



const staticPath = path.join(__dirname, "../public")
const templatePath = path.join(__dirname, "../template/views")
const partialPath = path.join(__dirname, "../template/partials")


app.use(express.static(staticPath))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(userRouter)
app.use(cookieParser())



app.set("view engine", "hbs")
app.set("views", templatePath)
hbs.registerPartials(partialPath)






app.get("/secret", auth, (req, res) => {
    res.render("secret")
})
app.get("/logout", auth, async (req, res) => {
    try {
        console.log(req.userDetatil)

        // logout from single devices
        req.userDetatil.tokens = req.userDetatil.tokens.filter((curElement) => {
            return curElement.token != req.token
        })

        // logout from all the devices
        req.userDetatil.tokens = []

        res.clearCookie("jwt")

        console.log("User logout from this device")
        await req.userDetatil.save()
        res.render("login")
    } catch (err) {
        res.status(500).send(err)
    }
})


app.get("/", (req, res) => {

    res.render("signUp")
})
app.get("/login", (req, res) => {
    res.render("login")
})




app.listen(port, () => {
    console.log(`Listening to the port at ${port}`);
})
