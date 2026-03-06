import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

/*export const signup = async (req, res) => 
this func must save the user to database
hashing the password and gareting the token  to 
ot test it we can use postman   */
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    /* hash passoword  -> we install package:
    "bcryptjs" in package.json
    why we use it ? exsample
    123456
    we dont want to save this password like this in database 
    we want to save it not the same thing 
     exsample like this :"asnfinsw82ndks"
   ====>>> we dont want someone to read it
   this mean we must to hash the password
    */

    if (!fullName || !email || !password) {
      // if one of them empty
      return res.status(400).json({ message: "all fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "password must be at least 6 characters" });
    }
    //cheak if the user exist
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    // now we want to hash the password  //we do import to bcrypt
    const salt = await bcrypt.genSalt(10); //do 10 basicily
    const hashedPassword = await bcrypt.hash(password, salt);
    //now will take this 123456 and do => asdasgm3ffe
    //---------------------
    //now creat new user
    const newUser = new User({
      /*fullName:fullName,
    email:email,
    this part is the same thig we can do:
    */
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // we can generate jwt token here
      //generateToken(the user id,respons)
      // it can sent the cookie in respons
      generateToken(newUser._id, res);
      await newUser.save(); //save the user to database
      // now we can sent sucsses message
      // 201: mean something has be created
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Inavlid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "internal server error" });
  }
};

/*user send => email and password 
user cheak email if exsit and password is ok   if ok => login   

*/
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    //cheak the user is in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "invalid credenials(email/password not found" });
    }
    //password was hash:(the new hash password (user.password) this from database)
    // password : the new password the user sent
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ message: "invalid credenials(email/password not found" });
    }
    //if it is correct:
    generateToken(user._id, res);
    //user data back to clint
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("error in login controller", error.message);
    res.status(500).json({ message: "internal server error" });
  }
};

export const logout = (req, res) => {
  //just must clear out the cookies
  /*the cookies name we do jwt and we will give this value 
  empty string thats mean clear out
  */
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "logged out successfuly" });
  } catch (error) {
    console.log("error in logout controller", error.message);
    res.status(500).json({ message: "internal server error" });
  }
};

/*to update profile image we need a service that we can
upload our images into and this will be cloudinary 
uoy can visit cloudinary.com ->login ->dashboard
ther is cloud name that we will be useing copy it  and put in .env =>CLOUDINAR_CLOUD_NAME
*/
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    //then we can update the user in database
    const updateUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );
    res.status(200).json(updateUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "internal server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    //say just send the user back to the clint
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
