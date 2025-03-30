import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

import admin from 'firebase-admin';
import { readFileSync } from 'fs';

const serviceAccount = JSON.parse(
  readFileSync(path.join(__dirname, '../keys/serviceAccountKey.json'), 'utf8')
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

console.log("Firebase initialized with DB URL:", process.env.FIREBASE_DATABASE_URL); // ✅ Debugging

const db = admin.database();

export { admin, db };
