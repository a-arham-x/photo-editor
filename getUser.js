const { verify } = require("jsonwebtoken")

export const getUser = (userToken)=>{
    const string = verify(userToken, process.env.JWT_SECRET)
    return string.user;
}

// const user = getUser("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyfSwiaWF0IjoxNzA2NTM2NjY4fQ.H8_Y2WBA3hZFRQXg6LK-4o6Y-oLHTYSoDgstaoZ7QVM")
// console.log(user);