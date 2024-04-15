
  import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useLocation, useParams } from 'react-router-dom';

const firebaseConfig = {
    apiKey: "AIzaSyDQPPhB__70tAfuXvVVtRFLy00neimVKoo",
    authDomain: "snapsolutions-3b9c8.firebaseapp.com",
    projectId: "snapsolutions-3b9c8",
    storageBucket: "snapsolutions-3b9c8.appspot.com",
    messagingSenderId: "507730201809",
    appId: "1:507730201809:web:d2173f11cbd2f13d3909f0",
    measurementId: "G-EF4K3KSYWE"
  };


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const Chat = () => {
    const location = useLocation();

    const senderId = location.state.senderId;
    const senderName = location.state.senderName;
    const receiverId = location.state.receiverId;
    const receiverName = location.state.receiverName;
    console.log(senderId)
    console.log(senderName)
    console.log(receiverId)
    console.log(receiverName)
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    const chatRef = collection(
      db,
      "chats",
      getChatId(senderId, receiverId),
      "messages"
    );

    const unsubscribeChat = onSnapshot(chatRef, (snapshot) => {
      const messages = snapshot.docs.map((doc) => doc.data());
      setChat(messages);
    });

    return () => unsubscribeChat();
  }, [senderId, receiverId, db]);

  const getChatId = (userId1, userId2) => {
    return userId1 < userId2 ? `${userId1}_${userId2}` : `${userId2}_${userId1}`;
  };

  const sendMessage = async () => {
    if (message.trim() === "") return;

    const chatRef = collection(
      db,
      "chats",
      getChatId(senderId, receiverId),
      "messages"
    );

    await addDoc(chatRef, {
      text: message,
      timestamp: serverTimestamp(),
      senderId: senderId,
      senderName: senderName,
    });

    setMessage("");
  };

  return (
    <div style={{ width: "400px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Chat with {receiverName}</h2>

      <div style={{ border: "1px solid #ccc", padding: "10px", height: "400px", overflowY: "scroll" }}>
        {chat.map((msg) => (
          <div key={msg.timestamp?.seconds} style={{ marginBottom: "10px" }}>
            <strong>{msg.senderName}:</strong> {msg.text}
          </div>
        ))}
      </div>

      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ padding: "8px", width: "70%", marginRight: "10px", border: "1px solid #ccc" }}
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "8px 15px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
