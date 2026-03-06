import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getUsersForSidebar,
  getMessages,
  sendMessage,
} from "../controllers/message.controller.js";
const router = express.Router();

/*the get func to can see the users in the side pare(the side pare in the word explain (like wahtsup))
 and protectRoute: the side pare must be protect not evry one can see it 
and the function name : getUsersForSidebar  => creat in message.controller.js
*/
router.get("/users", protectRoute, getUsersForSidebar);

//now we want to get mesaages between 2 users
//getMessages we want to creat in message.controller.js
router.get("/:id", protectRoute, getMessages);

// we want to can send mesaages:
router.post("/send/:id", protectRoute, sendMessage);

export default router;
