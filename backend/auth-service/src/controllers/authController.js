import { admin, db } from '../../../shared/initFirebase.js';
import bcrypt from 'bcrypt';

export default {
    async register(req, res) {
        try {
            const { email, username, password } = req.body;

            if (!email || !password || !username) {
                return res.status(400).json({ error: 'Missing parameters in the request body' });
            }

            let checkExistEmail;
            try {
                checkExistEmail = await admin.auth().getUserByEmail(email);
            } catch (err) {
                if (err.code !== 'auth/user-not-found') {
                    throw err;
                }
            }

            if (checkExistEmail) {
                return res.status(400).json({ error: 'The email is already taken.' });
            }

            const usersSnapshot = await db.ref('users').orderByChild('username').equalTo(username).get();
            if (usersSnapshot.exists()) {
                return res.status(400).json({ error: 'The username is already taken.' });
            }

            const userRecord = await admin.auth().createUser({
                email,
                password,
                displayName: username
            });

            await db.ref(`users/${userRecord.uid}`).set({
                email,
                username
            });

            return res.status(201).json({
                message: 'The user has been successfully registered',
                uid: userRecord.uid
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    },


    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'Missing parameters in the request body' });
            }

            const signIn = async (email, password) => {
                const apiKey = process.env.FIREBASE_API_KEY;
                const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email,
                        password,
                        returnSecureToken: true
                    })
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error.message);
                }
                return data.idToken;
            };
            const idToken = await signIn(email, password);

            return res.status(200).json({
                message: 'Login successful',
                idToken
            });
 
        } catch (err) {
            console.error(err);
            res.status(401).json({ error: err.message });
        }
    }
};


    