import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const Profile = () => {
  const user = auth.currentUser;
  const [profile, setProfile] = useState({
    username: "",
    bio: "",
    profileImageURL: "",
    passions: "",
    freeTime: "",
    qualitiesInFriend: "",
    dreams: "",
    deepTalkTopic: ""
  });

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setProfile(userDoc.data());
        }
      };
      fetchProfile();
    }
  }, [user]);

  return (
    <div>
      <h2>{profile.username || "No Username"}</h2>
      {profile.profileImageURL && <img src={profile.profileImageURL} alt="Profile" width="100" />}
      <p><strong>Bio:</strong> {profile.bio || "No Bio"}</p>

      <h3>About Me</h3>
      <p><strong>Passions:</strong> {profile.passions || "Not provided"}</p>
      <p><strong>How I Spend My Free Time:</strong> {profile.freeTime || "Not provided"}</p>
      <p><strong>Qualities I Value in a Friend:</strong> {profile.qualitiesInFriend || "Not provided"}</p>
      <p><strong>My Dreams & Goals:</strong> {profile.dreams || "Not provided"}</p>
      <p><strong>Topics I Love to Deep Talk About:</strong> {profile.deepTalkTopic || "Not provided"}</p>
    </div>
  );
};

export default Profile;
