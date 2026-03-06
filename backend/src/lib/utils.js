// to genrat token first we need env virable
//in .env :   JWT_SECRET

import jwt from "jsonwebtoken";
export const generateToken = (userId, res) => {
  // here we will creat a token
  // to do it we use import jwt
  // 1)by userId we can see  witch user belong to this token
  //2)the secret of privaty : JWT_SECRET
  //3) OBJECT WE WANT TO EXPRIES IN 7 DAY

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  //4) i want to sent  the  JWT in cockis
  // (the name jwt,the token we want to sent ,
  //  but some opchins to be more secerty
  //this will be object)
  res.cookie("jwt", token, {
    //max-age =must be in milliseconds
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, //prevent XSS attacks cross-site scripting attacks  //this be more secrtiy
    sameSite: "strict", //CSRF attacks cross-site request forgery attacks
    //---------------
    /*
secure:this detrmin if this https or http:
if we in localhost  this http will be not secure 
and this s in http(s) this mean secure 

*/

    //-----------------------
    //process.env.NODE_ENV!=="development"
    // we will say here this will be  true  if we in production
    secure: process.env.NODE_ENV !== "development",
  });
  //if false return the token
  return token;
};
