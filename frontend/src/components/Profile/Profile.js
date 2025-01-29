import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const Profile = () => {
  const user = auth.currentUser;
  const [profile, setProfile] = useState({ username: "", bio: "", profileImageURL: "" });

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
      <p>{profile.bio || "No Bio"}</p>
      {profile.profileImageURL && <img src={profile.profileImageURL} alt="Profile" width="100" />}
    </div>
  );
};

export default Profile;
