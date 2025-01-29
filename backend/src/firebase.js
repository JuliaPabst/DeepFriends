import admin from "firebase-admin";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

// Initialize Firebase Admin SDK
const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)),
});

const auth = admin.auth();

export { firebaseApp, auth };
