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
      "username": "LenaInnovator",
      "email": "lena@example.com",
      "bio": "Passionate about technology and creating new things.",
      "profileImageURL": "https://via.placeholder.com/100",
      "passions": "AI, Robotics",
      "freeTime": "Building gadgets, Reading sci-fi",
      "qualitiesInFriend": "Creativity, Curiosity",
      "dreams": "Invent a groundbreaking AI assistant",
      "deepTalkTopic": "Future of AI, Space Exploration"
    },
    {
      "username": "MarcoMusician",
      "email": "marco@example.com",
      "bio": "Guitarist and songwriter, always looking for inspiration.",
      "profileImageURL": "https://via.placeholder.com/100",
      "passions": "Music, Songwriting",
      "freeTime": "Playing guitar, Performing",
      "qualitiesInFriend": "Honesty, Passion",
      "dreams": "Record a hit album",
      "deepTalkTopic": "Music and emotions, Artistic struggles"
    },
    {
      "username": "SamanthaScientist",
      "email": "samantha@example.com",
      "bio": "Dedicated researcher in climate change.",
      "profileImageURL": "https://via.placeholder.com/100",
      "passions": "Science, Sustainability",
      "freeTime": "Hiking, Writing articles",
      "qualitiesInFriend": "Intelligence, Open-mindedness",
      "dreams": "Help reverse climate change",
      "deepTalkTopic": "Global warming, Ethical science"
    },
    {
      "username": "JakeAthlete",
      "email": "jake@example.com",
      "bio": "Competitive sprinter with a passion for fitness.",
      "profileImageURL": "https://via.placeholder.com/100",
      "passions": "Running, Health",
      "freeTime": "Gym, Competing in marathons",
      "qualitiesInFriend": "Determination, Energy",
      "dreams": "Win an Olympic medal",
      "deepTalkTopic": "Discipline and motivation, Overcoming failure"
    },
    {
      "username": "NinaNatureLover",
      "email": "nina@example.com",
      "bio": "Environmental activist and wildlife photographer.",
      "profileImageURL": "https://via.placeholder.com/100",
      "passions": "Nature, Wildlife",
      "freeTime": "Camping, Taking photos",
      "qualitiesInFriend": "Compassion, Patience",
      "dreams": "Publish a book on endangered species",
      "deepTalkTopic": "The beauty of nature, Saving our planet"
    },
    {
      "username": "EthanEntrepreneur",
      "email": "ethan@example.com",
      "bio": "Startup founder trying to change the world.",
      "profileImageURL": "https://via.placeholder.com/100",
      "passions": "Business, Innovation",
      "freeTime": "Networking, Reading business books",
      "qualitiesInFriend": "Ambition, Vision",
      "dreams": "Build a billion-dollar company",
      "deepTalkTopic": "Success vs. happiness, Taking risks"
    },
    {
      "username": "OliviaBookworm",
      "email": "olivia@example.com",
      "bio": "Novelist in the making, addicted to books.",
      "profileImageURL": "https://via.placeholder.com/100",
      "passions": "Literature, Writing",
      "freeTime": "Reading novels, Attending book clubs",
      "qualitiesInFriend": "Empathy, Deep thinking",
      "dreams": "Publish a bestselling novel",
      "deepTalkTopic": "The power of storytelling, Creativity"
    },
    {
      "username": "CarlosChef",
      "email": "carlos@example.com",
      "bio": "Passionate about cooking and discovering flavors.",
      "profileImageURL": "https://via.placeholder.com/100",
      "passions": "Food, Culinary arts",
      "freeTime": "Trying new recipes, Hosting dinner parties",
      "qualitiesInFriend": "Generosity, Adventure",
      "dreams": "Open a Michelin-starred restaurant",
      "deepTalkTopic": "Culture through cuisine, Creativity in cooking"
    },
    {
      "username": "SophiaDancer",
      "email": "sophia@example.com",
      "bio": "Expressing myself through dance, always moving.",
      "profileImageURL": "https://via.placeholder.com/100",
      "passions": "Dance, Performance",
      "freeTime": "Practicing routines, Watching dance performances",
      "qualitiesInFriend": "Energy, Expression",
      "dreams": "Perform on a world stage",
      "deepTalkTopic": "The language of movement, Art in motion"
    },
    {
      "username": "DerekGamer",
      "email": "derek@example.com",
      "bio": "Competitive esports player & game developer.",
      "profileImageURL": "https://via.placeholder.com/100",
      "passions": "Gaming, Technology",
      "freeTime": "Streaming, Coding games",
      "qualitiesInFriend": "Strategy, Teamwork",
      "dreams": "Develop a top-selling game",
      "deepTalkTopic": "The future of gaming, Virtual reality"
    },
    {
      "username": "IsabellaPsychologist",
      "email": "isabella@example.com",
      "bio": "Fascinated by the human mind & emotions.",
      "profileImageURL": "https://via.placeholder.com/100",
      "passions": "Psychology, Philosophy",
      "freeTime": "Studying behaviors, Listening to stories",
      "qualitiesInFriend": "Understanding, Non-judgmental",
      "dreams": "Make therapy accessible to all",
      "deepTalkTopic": "Mental health, Emotional intelligence"
    },
    {
      "username": "LiamProgrammer",
      "email": "liam@example.com",
      "bio": "Full-stack developer and AI enthusiast.",
      "profileImageURL": "https://via.placeholder.com/100",
      "passions": "Coding, AI",
      "freeTime": "Hackathons, Solving problems",
      "qualitiesInFriend": "Logic, Creativity",
      "dreams": "Build the next big AI product",
      "deepTalkTopic": "Ethics of AI, The future of coding"
    },
    {
      "username": "EmilyArtist",
      "email": "emily@example.com",
      "bio": "Bringing imagination to life through paintings.",
      "profileImageURL": "https://via.placeholder.com/100",
      "passions": "Art, Creativity",
      "freeTime": "Sketching, Exploring galleries",
      "qualitiesInFriend": "Imagination, Sensitivity",
      "dreams": "Host a solo art exhibition",
      "deepTalkTopic": "What is beauty?, The creative process"
    },
    {
      "username": "AaronComedian",
      "email": "aaron@example.com",
      "bio": "Making people laugh is my superpower.",
      "profileImageURL": "https://via.placeholder.com/100",
      "passions": "Comedy, Stand-up",
      "freeTime": "Writing jokes, Performing",
      "qualitiesInFriend": "Humor, Positivity",
      "dreams": "Have my own Netflix special",
      "deepTalkTopic": "Comedy as truth, The power of laughter"
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
