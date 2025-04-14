const {Schema , model} = require('mongoose');

const commentSchema = new Schema({
    content:{
        type:String,
        required:true
    },
    blogBy:{
        type: Schema.Types.ObjectId,
        ref: "Blog"
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
},{timeStamp:true})

const comment = new model("Comment",commentSchema)
module.exports={comment}