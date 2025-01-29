import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom"; // For opening chat page

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [username, setUsername] = useState(null);
  const user = auth.currentUser;
  const navigate = useNavigate(); // 🔗 Navigate to chat

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
    navigate(`/chat/${match.id}`); // Open chat page
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

// 🔥 Match Card Component (Fetches Full User Info)
const MatchCard = ({ match, matchUsername, openChat }) => {
  const [matchProfile, setMatchProfile] = useState(null);

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

  return (
    <div 
      style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "10px", marginBottom: "10px", cursor: "pointer", display: "flex", alignItems: "center" }}
      onClick={() => openChat(match)}
    >
      {matchProfile && <img src={matchProfile.profileImageURL} alt="Profile" style={{ width: "50px", height: "50px", borderRadius: "50%", marginRight: "10px" }} />}
      <div>
        <h3>{matchProfile ? matchProfile.username : "Loading..."}</h3>
        <p><strong>Bio:</strong> {matchProfile?.bio}</p>
        <p><strong>Interests:</strong> {matchProfile?.passions}</p>
        <p><strong>Free Time:</strong> {matchProfile?.freeTime}</p>
        <p><strong>Qualities in a Friend:</strong> {matchProfile?.qualitiesInFriend}</p>
        <p><strong>Dreams:</strong> {matchProfile?.dreams}</p>
        <p><strong>Deep Talk Topics:</strong> {matchProfile?.deepTalkTopic}</p>
        <p><strong>Reason Matched:</strong> {match.reason}</p>
      </div>
    </div>
  );
};

export default Matches;
