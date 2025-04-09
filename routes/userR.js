const {Router} = require('express')
const { UserModel } = require('../models/user')



const router = Router();

router.get('/signUp', (req,res)=>{
    return res.render('signup')
})

router.get('/signIn', (req,res)=>{
    return res.render('signin')
})

router.post('/signUp', async(req,res) =>{
    const { Fullname, email, password} = req.body || {};
    await UserModel.create({
        Fullname,
        email,
        password
    });

    return res.redirect('/')

})
 
router.post('/signIn',async(req,res)=>{
    const { email, password} = req.body || {};
    try{
    const token = await UserModel.matchPasswordAndGenerateToken(email,password);
    return res.cookie("token", token).redirect("/")
    }
    catch(error)
    {
        return res.render("signin" , {error:"incorrect password"}) 
    }

})

router.get("/logout",(req,res)=>{
    res.clearCookie('token').redirect("/")
})



module.exports = router;