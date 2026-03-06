//when we want valitaed token we need this packege:
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    //first cheke if there is  token or not
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized-no Token Provided" });
    }
    //to grab the token from the cookies we must to use this packeg :cookie-parser
    // we will do import to this packege in th =e index.js
    ///if we have token we need to  decode it
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized-Token Provided" });
    }
    const user = await User.findById(decoded.userId).select("-password"); //we dont want to send the password back to clinet

    if (!user) {
      return res.status(400).json({ message: "user nit found" });
    }
    // if every thing is ok :
    req.user = user;
    //call hte next fun => remember :router.put("/update-profile",protectRoute,updateProfile)    this in auth.route.js
    // this is the next func  : updateProfile
    next();
  } catch (error) {
    console.log("Error in protecRoute  middleware", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
