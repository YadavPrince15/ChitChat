import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { io,userSocketMap } from "../server.js";



// Get all users except the logged-in user
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    //Count no. of message not seen
    const unseenMessages = {}
    const promises = filteredUsers.map(async (user)=>{
        const messages = await Message.find({senderId:user._id,receiverId:loggedInUserId, seen:false})
        if(messages.length > 0){
            unseenMessages[user._id] = messages.length;
        }
    })
    await Promise.all(promises);

    return res.json({ success: true, users: filteredUsers, unseenMessages });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get conversation between selected users
export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params; 
    const loggedInUserId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: loggedInUserId, receiverId: selectedUserId },
        { senderId:selectedUserId, receiverId: loggedInUserId },
      ],
    }).sort({ createdAt: 1 }); // oldest to newest

    await Message.updateMany({senderId: selectedUserId, receiverId: loggedInUserId},{seen: true})

    return res.json({ success: true, messages });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark messages as seen using message id
export const markMessageAsSeen = async (req, res) => {
  try {
    const { userId } = req.params; // chat partner's ID
    await Message.findByIdAndUpdate(userId,{seen: true})
    res.json({success: true})
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Send a new message to selected user
export const sendMessage = async (req, res) => {
  try {
    const {text, image } = req.body;
    const senderId = req.user._id;
    const receiverId = req.params.id;

    if (!receiverId) {
      return res.status(400).json({ success: false, message: "Receiver ID is required" });
    }

    let imageUrl;
    if(image){
        const uploadResponse = await cloudinary.uploader.upload(image)
        imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    //Emit the new message to the reciever's socket
    const recieverSocketId = userSocketMap[receiverId];
    if(recieverSocketId){
      io.to(recieverSocketId).emit("newMessage", newMessage)
    }

    
    return res.status(201).json({
      success: true,
      newMessage,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};