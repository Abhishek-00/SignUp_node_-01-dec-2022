require("dotenv").config()
const mongoose = require("mongoose")


mongoose.connect(process.env.SECRET_MONGO, {
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(() => {
    console.log("Connection is sucessful to database (MongoDB)");
}).catch((err) => {
    console.log(err);
})


