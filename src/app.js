const express = require("express")
const app = express()
const hbs = require("hbs")
const path = require("path")
require("./db/db")                         /* connection to database */
const user = require("./models/model")
const userRouter = require("./router/router")

 
const port = process.env.PORT || 3000



const staticPath = path.join(__dirname, "../public")
const templatePath = path.join(__dirname, "../template/views")
const partialPath = path.join(__dirname,"../template/partials")


app.use(express.static(staticPath))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(userRouter)



app.set("view engine", "hbs")
app.set("views", templatePath)
hbs.registerPartials(partialPath)



app.get("/", (req, res) => {
    res.render("signUp")
})
app.get("/login", (req, res) => {
    res.render("login")
})




app.listen(port,() => {
    console.log(`Listening to the port at ${port}`);
})
