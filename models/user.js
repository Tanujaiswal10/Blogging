const { error } = require('console');
const{createHmac, randomBytes} = require('crypto')

const {Schema , model} = require('mongoose');

const {createJwtToken} = require('../services/authentication')

const userSchema = new Schema({
    Fullname: {
        type : String,
        required:true,
    },
    email:{
        type : String,
        required:true,
        unique:true,
    },
    salt:{
        type : String,
    },
    password:{
        type : String,
        required:true,
    },
    image:{
        type:String,
        default:"/image/userAvatarM.png"
    },
    role:{
        type:String,
        enum:["User","Admin"],
        default:"User"
    }
});



userSchema.pre('save',function(next){
    const user = this;
   if (!user.isModified('password')) {
    console.log("Password is not modified.");
}
    const salt = randomBytes(10).toString('hex');
    const hashedPassword = createHmac("sha256",salt).update(user.password).digest('hex');

    this.salt = salt;
    this.password=hashedPassword;

    next();

})


userSchema.static("matchPasswordAndGenerateToken",async function(email,password) {
    const user = await this.findOne({email});
    if(!user)  throw new Error("no user found");

    const salt = user.salt;
    const hashPassword = user.password;

    const userHashedPassword = createHmac("sha256",salt).update(password).digest('hex');

    if(hashPassword !== userHashedPassword) 
        {throw new Error("Incorrect password");}

    const token = createJwtToken(user);
    return token;
})

const UserModel = new model('User',userSchema);

module.exports = {UserModel};