import admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();

const projectId = process.env.FIREBASE_ACCOUNT_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ACCOUNT_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (projectId && clientEmail && privateKey) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
    console.log("✅ Firebase Admin initialized successfully");
  } catch (err) {
    console.warn("⚠️ Firebase Admin initialization failed:", err);
  }
} else {
  console.log("ℹ️ Firebase credentials not provided in .env — email/password & JWT authentication active.");
}

export default admin;
