import "dotenv/config";
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// ✅ Print raw JSON to debug issues
console.log("RAW FIREBASE_SERVICE_ACCOUNT_KEY:", process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

let serviceAccountKey;

try {
  serviceAccountKey = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  console.log("✅ Parsed JSON successfully!");
} catch (error) {
  console.error("❌ ERROR: Invalid JSON format in .env file!", error.message);
  process.exit(1);
}

// ✅ Fix private key formatting (replace `\\n` with actual newlines)
serviceAccountKey.private_key = serviceAccountKey.private_key.replace(/\\n/g, "\n");

// ✅ Ensure `client_email` exists before initializing Firebase
if (!serviceAccountKey.client_email) {
  console.error("❌ ERROR: `client_email` is missing from the service account JSON!");
  process.exit(1);
}

// ✅ Initialize Firebase Admin SDK
const app = initializeApp({
  credential: cert(serviceAccountKey),
});

const auth = getAuth();
const db = getFirestore();

const dummyUsers = [
  {
    username: "AliceWonder",
    email: "alice@example.com",
    bio: "Tech lover and traveler",
    profileImageURL: "https://via.placeholder.com/100",
    passions: "Technology, Music",
    freeTime: "Hiking, Reading",
    qualitiesInFriend: "Honesty, Humor",
    dreams: "Start my own company",
    deepTalkTopic: "Future of AI, Consciousness",
  },
  {
    username: "BobAdventurer",
    email: "bob@example.com",
    bio: "Explorer and photographer",
    profileImageURL: "https://via.placeholder.com/100",
    passions: "Travel, Photography",
    freeTime: "Camping, Biking",
    qualitiesInFriend: "Kindness, Loyalty",
    dreams: "Travel the world",
    deepTalkTopic: "Human nature, Ethics",
  }
];

const createDummyUsers = async () => {
  for (const user of dummyUsers) {
    try {
      const userCredential = await auth.createUser({
        email: user.email,
        password: "Password123!",
        displayName: user.username,
      });

      const userId = userCredential.uid;
      await db.collection("users").doc(userId).set({ uid: userId, ...user });

      console.log(`✅ Created user: ${user.username} (UID: ${userId})`);
    } catch (error) {
      console.error(`❌ Error creating user ${user.email}:`, error.message);
    }
  }
  console.log("🎉 All dummy users created successfully!");
};

createDummyUsers();
