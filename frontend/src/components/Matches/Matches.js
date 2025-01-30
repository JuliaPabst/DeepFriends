import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { collection, query, where, getDocs, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [username, setUsername] = useState(null);
  const user = auth.currentUser;
  const navigate = useNavigate();

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

  useEffect(() => {
    if (!username) return;

    const fetchMatches = async () => {
      try {
        const matchesQuery1 = query(collection(db, "matches"), where("user1", "==", username));
        const matchesQuery2 = query(collection(db, "matches"), where("user2", "==", username));

        const querySnapshot1 = await getDocs(matchesQuery1);
        const querySnapshot2 = await getDocs(matchesQuery2);

        const allMatches = [...querySnapshot1.docs, ...querySnapshot2.docs].map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setMatches(allMatches);
      } catch (error) {
        console.error("Error fetching matches:", error);
      }
    };

    fetchMatches();
  }, [username]);

  const openChat = (match) => {
    navigate(`/chat/${match.id}`);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>Your Matches</h2>

      {matches.length === 0 ? (
        <p>No matches yet! Keep interacting to find connections. 🤝</p>
      ) : (
        matches.map((match, index) => {
          const matchUsername = match.user1 === username ? match.user2 : match.user1;

          return (
            <MatchCard key={index} match={match} matchUsername={matchUsername} openChat={openChat} />
          );
        })
      )}
    </div>
  );
};

// 🔥 Match Card Component with Accept/Remove Match Buttons
const MatchCard = ({ match, matchUsername, openChat }) => {
  const [matchProfile, setMatchProfile] = useState(null);
  const [isAccepted, setIsAccepted] = useState(match.accepted || false); // Track match acceptance

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userQuery = query(collection(db, "users"), where("username", "==", matchUsername));
      const querySnapshot = await getDocs(userQuery);
      if (!querySnapshot.empty) {
        setMatchProfile(querySnapshot.docs[0].data());
      }
    };

    fetchUserProfile();
  }, [matchUsername]);

  // ✅ Accept Match Function
  const acceptMatch = async () => {
    try {
      const matchRef = doc(db, "matches", match.id);
      await updateDoc(matchRef, { accepted: true });
      setIsAccepted(true);
    } catch (error) {
      console.error("Error accepting match:", error);
    }
  };

  // ❌ Remove Match Function
  const removeMatch = async () => {
    try {
      const matchRef = doc(db, "matches", match.id);
      await deleteDoc(matchRef);
      setIsAccepted(false);
    } catch (error) {
      console.error("Error removing match:", error);
    }
  };

  return (
    <div 
      style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "10px", marginBottom: "10px", display: "flex", alignItems: "center", flexDirection: "column" }}
    >
      {matchProfile && <img src={matchProfile.profileImageURL} alt="Profile" style={{ width: "50px", height: "50px", borderRadius: "50%", marginBottom: "10px" }} />}
      <h3>{matchProfile ? matchProfile.username : "Loading..."}</h3>
      <p><strong>Bio:</strong> {matchProfile?.bio}</p>
      <p><strong>Interests:</strong> {matchProfile?.passions}</p>
      <p><strong>Free Time:</strong> {matchProfile?.freeTime}</p>
      <p><strong>Qualities in a Friend:</strong> {matchProfile?.qualitiesInFriend}</p>
      <p><strong>Dreams:</strong> {matchProfile?.dreams}</p>
      <p><strong>Deep Talk Topics:</strong> {matchProfile?.deepTalkTopic}</p>
      <p><strong>Reason Matched:</strong> {match.reason}</p>

      {/* 🔥 Accept or Remove Match Button */}
      {!isAccepted ? (
        <button onClick={acceptMatch} style={{ background: "green", color: "white", padding: "10px", marginTop: "10px", border: "none", cursor: "pointer", borderRadius: "5px" }}>
          ✅ Accept Match
        </button>
      ) : (
        <button onClick={removeMatch} style={{ background: "red", color: "white", padding: "10px", marginTop: "10px", border: "none", cursor: "pointer", borderRadius: "5px" }}>
          ❌ Remove Match
        </button>
      )}

      {/* 🔗 Open Chat Button */}
      <button onClick={() => openChat(match)} style={{ background: "#007bff", color: "white", padding: "10px", marginTop: "10px", border: "none", cursor: "pointer", borderRadius: "5px" }}>
        💬 Start Chat
      </button>
    </div>
  );
};

export default Matches;
