require("dotenv").config()

const path = require("path")
const express = require('express');
const app = express();
const userRoute = require('./routes/userR');
const blogRoute = require('./routes/blogR');
const CookieParser = require('cookie-parser');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(CookieParser());
const mongoose = require('mongoose');
const { checkAuthenticationCookie } = require("./middlewares/authentication");
app.use(checkAuthenticationCookie('token'))
const {blogg} = require('./models/blog')

mongoose.connect(process.env.MONGO_URL).then(()=>{console.log("mongoose connected")}).catch("mongoose didnt connect")



app.set("view engine","ejs")
app.set("views", path.resolve('./views'))
app.use(express.static(path.resolve('./public')));
app.use('/images', express.static('public/images'));

app.use("/user", userRoute);

app.use("/blog", blogRoute)


app.get("/",async (req,res) =>{
    const allBlogs = await blogg.find({})
    return res.render("home",{blog:allBlogs, user: req.user})
})


const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=> {console.log(`Server started at: ${PORT}`)})