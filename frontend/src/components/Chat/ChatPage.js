import React, { useEffect, useState, useRef } from "react";
import { db, auth } from "../../firebase";
import { collection, doc, addDoc, onSnapshot, query, orderBy, serverTimestamp, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";

const ChatPage = () => {
  const { matchId } = useParams(); // 🔥 Get matchId from URL
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState(null);
  const [matchUsername, setMatchUsername] = useState(null); // 🔥 Store matched user's username
  const chatRef = useRef(null);
  const user = auth.currentUser; // 🔥 Get logged-in user

  useEffect(() => {
      if (!user) return;
  
      const fetchUsername = async () => {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUsername(userDoc.data().username);
          }
        } catch (error) {
          console.error("Error fetching username:", error);
        }
      };
  
      fetchUsername();
    }, [user]);

  // 🔥 Fetch match details to get the **correct** matched user's username
  useEffect(() => {
    if (!matchId || !user) return;

    const fetchMatchDetails = async () => {
      try {
        const matchDoc = await getDoc(doc(db, "matches", matchId));
        if (matchDoc.exists()) {
          const matchData = matchDoc.data();
          
          // ✅ If logged-in user is `user1`, show `user2` as match
          // ✅ If logged-in user is `user2`, show `user1` as match
          const matchedUser = matchData.user1 === username ?  matchData.user2 : matchData.user1;
          setMatchUsername(matchedUser);
        }
      } catch (error) {
        console.error("❌ Error fetching match details:", error);
      }
    };

    fetchMatchDetails();
  }, [matchId, user]);

  // 🔥 Fetch messages
  useEffect(() => {
    if (!matchId) return;

    const chatDocRef = doc(db, "chats", matchId);
    const messagesRef = collection(chatDocRef, "messages");

    const messagesQuery = query(messagesRef, orderBy("timestamp"));

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [matchId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const chatDocRef = doc(db, "chats", matchId);
    const messagesRef = collection(chatDocRef, "messages");

    await addDoc(messagesRef, {
      sender: user.displayName, // 🔥 Save sender name
      receiver: matchUsername, // 🔥 Save receiver name
      text: newMessage,
      timestamp: serverTimestamp(),
    });

    setNewMessage("");
    scrollToBottom();
  };

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>Chat with {matchUsername ? matchUsername : "your match"} 💬</h2>
      <div ref={chatRef} style={{ height: "300px", overflowY: "auto", border: "1px solid #ccc", padding: "10px", borderRadius: "5px", marginBottom: "10px" }}>
        {messages.length === 0 ? (
          <p>No messages yet. Start the conversation! ✨</p>
        ) : (
          messages.map((msg, index) => (
            <p key={index} style={{ textAlign: msg.sender === user.displayName ? "right" : "left" }}>
              <strong>{msg.sender}:</strong> {msg.text}
            </p>
          ))
        )}
      </div>

      <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatPage;
