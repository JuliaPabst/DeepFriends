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

  useEffect(() => {
    if (user) {
      const fetchUserProfile = async () => {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUsername(data.username || "");
          setBio(data.bio || "");
          setProfileImageURL(data.profileImageURL || "");
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

    // Save data to Firestore
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      username,
      bio,
      profileImageURL: imageURL
    }, { merge: true });

    alert("Profile updated!");
    setProfileImageURL(imageURL);
  };

  return (
    <div>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSaveProfile}>
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
        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
};

export default EditProfile;
