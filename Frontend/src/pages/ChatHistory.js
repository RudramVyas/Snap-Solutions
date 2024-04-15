import React, { useState, useEffect } from "react";
import { getFirestore, collection, doc, onSnapshot } from "firebase/firestore";

const ChatHistory = ({ userId="657759187e38c528c39e54c7" }) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const db = getFirestore();
        const chatCollection = collection(db, "chats");

        const querySnapshot = await onSnapshot(chatCollection, (snapshot) => {
          const chatsData = snapshot.docs.map((doc) => {
            const data = doc.data();
            return { id: doc.id, ...data };
          });
          setChats(chatsData);
        });

        return () => querySnapshot();
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
  }, []);

  const filterChatsBySender = () => {
    return chats.filter((chat) => chat.senderId === userId);
  };

  return (
    <div style={{ width: "400px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Chat History</h2>

      <div style={{ border: "1px solid #ccc", padding: "10px", height: "400px", overflowY: "scroll" }}>
        {filterChatsBySender().map((chat) => (
          <div key={chat.id} style={{ marginBottom: "10px" }}>
            <strong>{chat.receiverName}:</strong> {chat.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatHistory;
