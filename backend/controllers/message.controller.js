import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { performance } from "perf_hooks";
import { getReceiverSocketId, getIO } from "../socket/socket.js";
import os from "os";
import User from "../models/user.model.js";

// Funcția startCPUUsage măsoară utilizarea CPU la un moment dat
function startCPUUsage() {
  const cpus = os.cpus(); // Obține informații despre toate nucleele CPU
  let user = 0; // Timpul petrecut în modul user
  let sys = 0; // Timpul petrecut în modul kernel (system)
  let idle = 0; // Timpul petrecut în mod inactiv (idle)
  let irq = 0; // Timpul petrecut gestionând întreruperile hardware (IRQ)
  // Iterează prin fiecare nucleu CPU și adună timpii corespunzători
  cpus.forEach((cpu) => {
    user += cpu.times.user;
    sys += cpu.times.sys;
    idle += cpu.times.idle;
    irq += cpu.times.irq;
  });
  // Returnează un obiect cu timpii acumulați pentru fiecare categorie
  return { user, sys, idle, irq };
}

// Funcția getCPUUsage calculează utilizarea CPU între două momente
function getCPUUsage(startUsage) {
  const cpus = os.cpus();
  let user = 0;
  let sys = 0;
  let idle = 0;
  let irq = 0;
  cpus.forEach((cpu) => {
    user += cpu.times.user;
    sys += cpu.times.sys;
    idle += cpu.times.idle;
    irq += cpu.times.irq;
  });

  // Calculează diferențele dintre timpii acumulați la momentul actual și cei de la startUsage
  const userDiff = user - startUsage.user;
  const sysDiff = sys - startUsage.sys;
  const idleDiff = idle - startUsage.idle;
  const irqDiff = irq - startUsage.irq;
  const totalDiff = userDiff + sysDiff + idleDiff + irqDiff;

  // Returnează un obiect cu procentele de utilizare pentru fiecare categorie
  return {
    user: totalDiff ? ((userDiff / totalDiff) * 100).toFixed(2) : "0.00",
    sys: totalDiff ? ((sysDiff / totalDiff) * 100).toFixed(2) : "0.00",
    idle: totalDiff ? ((idleDiff / totalDiff) * 100).toFixed(2) : "0.00",
    irq: totalDiff ? ((irqDiff / totalDiff) * 100).toFixed(2) : "0.00",
  };
}

// Utilizată pentru introducerea de pauze (delay) în execuția codului
// Adăugată în scop didactic pentru a putea face măsurări
async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const sendMessage = async (req, res) => {
  try {
    const { message, replyTo } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    console.log("Sending message:", { message, receiverId, senderId, replyTo });
    
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
      replyTo,
    });
    
    // Encrypt message
    newMessage.encryptMessage();
    
    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }
    await Promise.all([conversation.save(), newMessage.save()]);
    
    // Decrypt message for client
    newMessage.decryptMessage();

    // Get Socket.IO instance
    const io = getIO();
    
    // Get receiver's socket ID
    const receiverSocketId = getReceiverSocketId(receiverId);
    const senderSocketId = getReceiverSocketId(senderId);
    
    if (receiverSocketId) {
      console.log("Emitting newMessage to receiver");
      io.to(receiverSocketId).emit("newMessage", newMessage);
      // Emit typing stopped event
      io.to(receiverSocketId).emit("typingStopped", { senderId });
    }
    if (senderSocketId) {
      console.log("Emitting newMessage to sender");
      io.to(senderSocketId).emit("newMessage", newMessage);
    }
    
    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateMessageStatus = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { status } = req.body;
    
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }
    
    await message.updateStatus(status);
    
    // Emit status update to sender
    const io = getIO();
    const senderSocketId = getReceiverSocketId(message.senderId);
    if (senderSocketId) {
      io.to(senderSocketId).emit("messageStatusUpdate", {
        messageId,
        status,
      });
    }
    
    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    console.log("Error in updateMessageStatus controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addReaction = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { reactionType } = req.body;
    const userId = req.user._id;
    
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }
    
    await message.addReaction(userId, reactionType);
    
    // Emit reaction update to all participants
    const io = getIO();
    const conversation = await Conversation.findOne({
      messages: messageId,
    });
    
    if (conversation) {
      conversation.participants.forEach((participantId) => {
        const socketId = getReceiverSocketId(participantId);
        if (socketId) {
          io.to(socketId).emit("messageReactionUpdate", {
            messageId,
            reactions: message.reactions,
          });
        }
      });
    }
    
    res.status(200).json({ message: "Reaction added successfully" });
  } catch (error) {
    console.log("Error in addReaction controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { newMessage } = req.body;
    const userId = req.user._id;
    
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }
    
    if (message.senderId.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Not authorized to edit this message" });
    }
    
    message.message = newMessage;
    message.encryptMessage();
    await message.markAsEdited();
    await message.save();
    
    // Emit edit update to all participants
    const io = getIO();
    const conversation = await Conversation.findOne({
      messages: messageId,
    });
    
    if (conversation) {
      conversation.participants.forEach((participantId) => {
        const socketId = getReceiverSocketId(participantId);
        if (socketId) {
          io.to(socketId).emit("messageEdited", {
            messageId,
            message: newMessage,
            isEdited: true,
            editedAt: message.editedAt,
          });
        }
      });
    }
    
    res.status(200).json({ message: "Message edited successfully" });
  } catch (error) {
    console.log("Error in editMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;
    
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }
    
    if (message.senderId.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Not authorized to delete this message" });
    }
    
    await message.markAsDeleted();
    
    // Emit delete update to all participants
    const io = getIO();
    const conversation = await Conversation.findOne({
      messages: messageId,
    });
    
    if (conversation) {
      conversation.participants.forEach((participantId) => {
        const socketId = getReceiverSocketId(participantId);
        if (socketId) {
          io.to(socketId).emit("messageDeleted", {
            messageId,
          });
        }
      });
    }
    
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.log("Error in deleteMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");
    
    if (!conversation) return res.status(200).json([]);
    
    const messages = conversation.messages.map((message) => {
      message.decryptMessage();
      return message;
    });
    
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
