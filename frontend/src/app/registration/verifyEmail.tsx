import { useEffect, useState } from "react";
import { getAuth, applyActionCode } from "firebase/auth";
import { useSearchParams } from "react-router-dom";
import { completeRegistration } from "./verifyEmailApi";
import crypto from "crypto-js";

const VerifyEmail = () => {
    const [message, setMessage] = useState("Verifying email...");
    const [searchParams] = useSearchParams();
    const auth = getAuth();
    const secretKey = 'SUPERDUPERSECRETKEY'; // Same key used in backend

    useEffect(() => {
        console.log("1");
        const oobCode = searchParams.get("oobCode"); // Get Firebase verification code
        const encryptedData = searchParams.get("data"); // Get encrypted user data

        if (!oobCode || !encryptedData) {
            setMessage("Invalid verification link.");
            return;
        }
        console.log("2");
        const verifyEmail = async () => {
            try {
                await applyActionCode(auth, oobCode);

                const decryptedData = JSON.parse(
                    crypto.AES.decrypt(decodeURIComponent(encryptedData), secretKey).toString(crypto.enc.Utf8)
                );
                console.log("3");
                const { email, username, password } = decryptedData;

                setMessage("Email verified! Completing registration...");

                await completeRegistration(email, username, password);

                setMessage("Registration completed!");

                window.location.href = "/login";

            } catch (error) {
                console.error("Verification error:", error);
                setMessage("An error occurred. Please try again.");
            }
        };

        verifyEmail();
    }, [searchParams]);

    return (
        
        <div>
            <h1>{message}</h1>
        </div>
    );
};

export default VerifyEmail;
