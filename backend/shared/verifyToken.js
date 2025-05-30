import { admin } from './initFirebase.js';

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (err) {
        console.error('Firebase Auth Error:', err.message);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

export default verifyToken;
