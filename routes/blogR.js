const {Router} = require('express')
const multer = require('multer');
const path = require('path')
const {blogg} = require('../models/blog');
const {comment} = require('../models/comment');
const { timeStamp } = require('console');

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

router.get("/:id", async(req,res)=>{
  const blog = await blogg.findById(req.params.id).populate("createdBy");
  const comments = await comment.find({blogBy : req.params.id}).populate("createdBy")
  console.log(comments)
  res.render('blog',{
    user:req.user,
    blog,
    comments
  })
})

// router.post("/comment/:blogId", async(req,res)=>{
//   console.log(req.body)
//   await comment.create({
//     content:req.body.comment,
//     createdBy:req.user._id,
//     blogBy:req.params.blogId,
//   })
// })



router.post("/comment/:blogId", async (req, res) => {
  try {
    const newComment = await comment.create({
      content: req.body.comment,
      createdBy: req.user._id,
      blogBy: req.params.blogId,
    });

    res.status(200).json({
      message: "Comment added successfully",
      comment: newComment
    });
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;