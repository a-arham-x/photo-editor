const { verify } = require("jsonwebtoken")

export const getUser = (userToken)=>{
    const string = verify(userToken, process.env.JWT_SECRET)
    return string.user;
}