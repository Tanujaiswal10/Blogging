const JWT = require('jsonwebtoken');
const secret = "OnePlus*12";

function createJwtToken(user)
{
    const payload = {
        _id: user._id,
        email:user.email,
        img:user.image,
        role:user.role
    }

    const token = JWT.sign(payload,secret);
    return token
}

function verifyToken(token)
{
    const payload = JWT.verify(token,secret)
    return payload
}

module.exports ={createJwtToken,verifyToken}