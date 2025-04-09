const {Router} = require('express')
const multer = require('multer');
const path = require('path')
const {blogg} = require('../models/blog');

const router = Router();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve('./public/uploads'))
    },
    filename: function (req, file, cb) {
      const filename = `${Date.now()}-${file.originalname}`;
      cb(null,filename)
    }
  })
  
  const upload = multer({ storage: storage })


router.get("/addblog",(req,res)=>{
    return res.render("addBlog", {
        user : req.user
    })
})

router.post("/",upload.single("coverImage"),async(req,res)=>{
    const {title,body} = req.body
    const blog = await blogg.create({
        title,body, createdBy : req.user._id,
        coverImageUrl : `/uploads/${req.file.filename}`
    })

    return res.redirect(`blog/${blog._id}`)
})


module.exports = router;