import "dotenv/config";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import OpenAI from "openai";

// ✅ Load Firebase Admin credentials from .env
const serviceAccountKey = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
const app = initializeApp({
  credential: cert(serviceAccountKey),
});

const db = getFirestore();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure you have an OpenAI API key in .env
});

// 🔹 Fetch all users from Firestore
async function getUsers() {
  const usersSnapshot = await db.collection("users").get();
  return usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// 🔹 Generate matches using OpenAI
async function generateMatches(users) {
  if (users.length < 2) {
    console.log("❌ Not enough users to match!");
    return [];
  }

  // ✅ Prepare the prompt for OpenAI
  const prompt = `
  You are an AI matchmaking assistant. Your goal is to pair users based on shared interests, hobbies, and personal values.
  Here are the users:

  ${users
    .map(
      (user, index) =>
        `User ${index + 1}: ${user.username}, Interests: ${user.passions}, Bio: ${user.bio}, Free time: ${user.freeTime}`
    )
    .join("\n")}

  Match users into **pairs** and provide 5 deep conversation-starting questions for each match. 
  Format your response as JSON:
  Example:
  [
    { 
      "user1": "AliceWonder", 
      "user2": "BobAdventurer", 
      "reason": "Both love travel and adventure.", 
      "questions": [
        "What is your most unforgettable travel experience?",
        "If you could live anywhere for a year, where would it be and why?",
        "What motivates you to explore new places?",
        "How has travel changed your perspective on life?",
        "If you could meet one historical explorer, who would it be?"
      ] 
    }
  ]
  `;

  // 🔥 Send request to OpenAI
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "system", content: prompt }],
    max_tokens: 1000,
  });

  try {
    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("❌ Error parsing OpenAI response:", error);
    return [];
  }
}

// 🔹 Save matches to Firestore with Questions
async function saveMatches(matches) {
  const batch = db.batch();
  const matchesCollection = db.collection("matches");

  matches.forEach((match) => {
    const matchRef = matchesCollection.doc();
    batch.set(matchRef, match);
  });

  await batch.commit();
  console.log("✅ Matches saved successfully with questions!");
}

// 🔥 Main function to run the matching service
async function runMatchingService() {
  console.log("🚀 Starting the user matching process...");
  const users = await getUsers();

  if (users.length < 2) {
    console.log("❌ Not enough users for matching.");
    return;
  }

  const matches = await generateMatches(users);

  if (matches.length > 0) {
    await saveMatches(matches);
  } else {
    console.log("❌ No matches found.");
  }
}

// Run the matching service
runMatchingService();
