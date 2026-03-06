import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

/* we want to see in the side bar  the outher users list (but not my name) */
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id; //this route is protect(protectRoute)this mean can tke the user from the requst
    //------------
    //this say find  all the users where id is not == qurent user id :
    // find all the users  but dont find the حالي login user  ({$ne:loggedInUserId})
    //and we want send every thing but not the passwprd
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error on getUsersForSidebear:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// the next func we want to do  get messages betwen 2 users
export const getMessages = async (req, res) => {
  try {
    //router.get("/:id", protectRoute, getMessages); (in message.roter.js)
    //take the same name alwas : id and rename it to somthing better
    //to read userToChatId
    //userToChatId : the other user
    const { id: userToChatId } = req.params;
    const myId = req.user._id;
    //now we want to find some messages:
    const messages = await Message.find({
      //find all the messages that i am the sender or the other user the sender
      $or: [
        { senderId: myId, receiverId: userToChatId }, //or
        {
          senderId: userToChatId,
          receiverId: myId,
        },
      ],
    });
    //retuen all the messages
    res.status(200).json(messages);
  } catch (error) {
    console.log("error in getMessages controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

/*ho we send messages? ===>sendMessage
this message can be text or image or anything 
*/
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    // i want cheack if user has image or not:
    let imageUrl;
    if (image) {
      //upload base64 image  to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    //then we can save this
    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    //if user is online
    if (receiverSocketId) {
      //(to(receversocketid))  --->only send this message to recever
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("error in getMessages controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
