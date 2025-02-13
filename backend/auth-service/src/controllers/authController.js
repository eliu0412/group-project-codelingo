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

            const snapshot = await db.ref(`usernames/${username}`).get();
            if (snapshot.exists()) {
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
            const { email, username, password } = req.body;

            if (!email || !password || !username) {
                return res.status(400).json({
                    error: 'Missing parameters in the request body'
                });
            }
            
            const user = await admin.auth().getUserByEmail(email);

            if (!user || !await bcrypt.compare(password, user.password)) {
                return res.status(401).json({
                    error: 'Invalid email or password'
                });
            }

            return res.status(200).json({
                message: 'Successfully logged in'
            });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({
                error: 'An error occurred while logging in the user.'
            });
        }
    }
};


    