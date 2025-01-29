import React, { useState, useEffect } from "react";
import { auth, db, storage } from "../../../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const EditProfile = () => {
  const user = auth.currentUser;
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageURL, setProfileImageURL] = useState("");
  
  // Survey fields
  const [passions, setPassions] = useState("");
  const [freeTime, setFreeTime] = useState("");
  const [qualitiesInFriend, setQualitiesInFriend] = useState("");
  const [dreams, setDreams] = useState("");
  const [deepTalkTopic, setDeepTalkTopic] = useState("");

  useEffect(() => {
    if (user) {
      const fetchUserProfile = async () => {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUsername(data.username || "");
          setBio(data.bio || "");
          setProfileImageURL(data.profileImageURL || "");

          // Pre-fill survey questions if they exist
          setPassions(data.passions || "");
          setFreeTime(data.freeTime || "");
          setQualitiesInFriend(data.qualitiesInFriend || "");
          setDreams(data.dreams || "");
          setDeepTalkTopic(data.deepTalkTopic || "");
        }
      };
      fetchUserProfile();
    }
  }, [user]);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!user) return;

    let imageURL = profileImageURL;

    // Upload new profile image if changed
    if (profileImage) {
      const imageRef = ref(storage, `profileImages/${user.uid}`);
      await uploadBytes(imageRef, profileImage);
      imageURL = await getDownloadURL(imageRef);
    }

    // Save profile and survey data to Firestore
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      username,
      bio,
      profileImageURL: imageURL,
      passions,
      freeTime,
      qualitiesInFriend,
      dreams,
      deepTalkTopic,
    }, { merge: true });

    alert("Profile updated!");
    setProfileImageURL(imageURL);
  };

  return (
    <div>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSaveProfile}>
        {/* Profile Fields */}
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
        <textarea 
          placeholder="Bio" 
          value={bio} 
          onChange={(e) => setBio(e.target.value)} 
        />
        <input type="file" onChange={handleImageChange} />
        {profileImageURL && <img src={profileImageURL} alt="Profile" width="100" />}

        {/* Survey Questions */}
        <h3>Tell us about yourself!</h3>

        <label>What are your biggest passions?</label>
        <input 
          type="text" 
          value={passions} 
          onChange={(e) => setPassions(e.target.value)} 
          required 
        />

        <label>How do you usually spend your free time?</label>
        <input 
          type="text" 
          value={freeTime} 
          onChange={(e) => setFreeTime(e.target.value)} 
          required 
        />

        <label>What qualities do you value most in a friend?</label>
        <input 
          type="text" 
          value={qualitiesInFriend} 
          onChange={(e) => setQualitiesInFriend(e.target.value)} 
          required 
        />

        <label>What is a dream or goal you are currently working towards?</label>
        <input 
          type="text" 
          value={dreams} 
          onChange={(e) => setDreams(e.target.value)} 
          required 
        />

        <label>If you could have a deep conversation with anyone, who would it be and why?</label>
        <input 
          type="text" 
          value={deepTalkTopic} 
          onChange={(e) => setDeepTalkTopic(e.target.value)} 
          required 
        />

        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
};

export default EditProfile;
