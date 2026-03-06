import express from "express";
import {
  login,
  logout,
  signup,
  updateProfile,
  checkAuth,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

/*
--------------------------------------------------------------------------
router.post("/signup", (req, res) => {
  res.send("signup route");
})
we will tack this :
 ,(req, res) => {
  res.send("signup route");
}) 

and put in function and will call from the  func this more good    from "auth.controlles.js"
-----------------------------------------------------------------------
*/
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

/*to update my profile :
put we want to protect it 
if user want to update the profile  -> if they are authenticated then 
we can call the next (next function) -> updateProfile 
thay can : update the database and upload the image ...

func protectRoute:
this middleware that was take in the previous section:
the user now has been authenticated ,they are going to send another request
and we just need to cheak if they have token
if they have ->they are going to vialidate it,
if it valid ->we will say ok you can update  your profile /send message /...
but if not we will say error 

*/
router.put("/update-profile", protectRoute, updateProfile);

//--------------------------------------------------------------------------
/*this will check if the user ia authenticated or not.

so if user is not  authenticated we are not going to call 
this function :protectRoute
-----------
but if it is protectRoute we can 
call the next function: checkAuth

//lets first creat this checkAuth in auth.controller.js   .
now if we refresh hte page we just need to check if user is authenticated 
*/

router.get("/check", protectRoute, checkAuth);

export default router;
