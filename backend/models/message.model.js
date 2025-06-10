import mongoose from "mongoose";
import crypto from "crypto";
import CryptoJS from "crypto-js";
import { performance } from "perf_hooks";

// Define the schema (structure) for a message
const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",  // Reference to the User model (sender)
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",  // Reference to the User model (receiver)
      required: true,
    },
    message: {
      type: String, // The encrypted message content
      required: true,
    },
    encryptionKey: {
      type: String, // The key used to encrypt the message (stored as hex)
      required: true,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt timestamps
);

// Function to generate a new encryption key
function generateEncryptionKey() {
  const keyBuffer = crypto.randomBytes(32); // Generate a 32-byte (256-bit) random buffer
  const hexKey = keyBuffer.toString("hex"); // Convert the buffer to a hexadecimal string
  const keyLengthBits = keyBuffer.length * 8; // Calculate the key length in bits
  return { hexKey, keyLengthBits }; // Return the key and its length
}

// Function to measure memory usage
function measureMemoryUsage() {
  const used = process.memoryUsage();
  console.log(`🧠  Physical memory [RSS]: ${(used.rss / 1024 / 1024).toFixed(2)} MB`);
  console.log(`🧠  Total heap allocated: ${(used.heapTotal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`🧠  Heap used: ${(used.heapUsed / 1024 / 1024).toFixed(2)} MB`);
}

// Method to encrypt the message
messageSchema.methods.encryptMessage = function () {
  // Measure the time taken to generate the key
  const startTimeGenerateKey = performance.now();
  const { hexKey, keyLengthBits } = generateEncryptionKey();
  const endTimeGenerateKey = performance.now();
  const timeGenerateKey = (endTimeGenerateKey - startTimeGenerateKey).toFixed(2);

  console.log("__________________________________________________________________________________________________________");
  console.log("🔒  Advanced Encryption Standard 256 [AES-256]  🔒");
  console.log("");

  // Measure memory before encryption
  console.log("📊  Measuring memory usage before encryption  🔒");
  measureMemoryUsage();
  console.log("");

  if (this.message) {
    const originalMessageLength = this.message.length; // Character length of original message
    const originalSize = Buffer.byteLength(this.message, "utf8"); // Byte size of original message

    const iv = CryptoJS.lib.WordArray.random(128 / 8); // Generate a random 16-byte IV

    // Encrypt the message with AES using the key and IV
    const encrypted = CryptoJS.AES.encrypt(
      this.message,
      CryptoJS.enc.Hex.parse(hexKey),
      { iv: iv }
    );

    // Combine IV and encrypted text as: iv:cipherText
    this.message = iv.toString(CryptoJS.enc.Hex) + ":" + encrypted.toString();
    const encryptedMessageLength = this.message.length;

    this.encryptionKey = hexKey;

    console.log("🔑  Encryption key: ", hexKey);
    console.log("📐  Encryption key size: " + keyLengthBits + " bits");
    console.log("⏱️  Key generation time: " + timeGenerateKey + " ms");
    console.log("");
    console.log("📏  Original message length: " + originalMessageLength + " characters");
    console.log("📐  Original message size: " + originalSize + " bytes");
    console.log("📏  Encrypted message length: " + encryptedMessageLength + " characters");
    console.log("");

    // Measure memory after encryption
    console.log("📊  Measuring memory usage after encryption  🔒");
    measureMemoryUsage();
    console.log("");
  }
};

// Method to decrypt the message
messageSchema.methods.decryptMessage = function () {
  if (this.message) {
    // Measure memory before decryption
    console.log("📊  Measuring memory usage before decryption  🔓");
    measureMemoryUsage();
    console.log("");

    const components = this.message.split(":"); // Split into [IV, encrypted text]
    const iv = CryptoJS.enc.Hex.parse(components[0]); // Convert IV from hex
    const ciphertext = components[1];

    // Decrypt using AES and the stored encryption key
    const decrypted = CryptoJS.AES.decrypt(
      ciphertext,
      CryptoJS.enc.Hex.parse(this.encryptionKey),
      { iv: iv }
    );

    this.message = decrypted.toString(CryptoJS.enc.Utf8); // Convert to readable text
    const decryptedMessageLength = this.message.length;

    // Measure memory after decryption
    console.log("📊  Measuring memory usage after decryption  🔓");
    measureMemoryUsage();
    console.log("");

    console.log("📏  Decrypted message length: " + decryptedMessageLength + " characters");
    console.log("");
  }
};

// Create the Message model from the schema
const Message = mongoose.model("Message", messageSchema);

// Export the Message model
export default Message;
