import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { completeRegistration } from "./verifyEmailApi";
import "./verifyEmail.css";

const VerifyEmail: React.FC = () => {
    const [message, setMessage] = useState("Verifying email...");
    const [searchParams] = useSearchParams();
    const hasVerified = useRef(false); // Add this to prevent double calls
    const navigate = useNavigate();

    const verifyEmail = async (encryptedData: string) => {
        try {
            const data = await completeRegistration(encryptedData);
            if (data.error) {
                throw new Error(data.error);
            }

            setMessage("Email verified! Redirecting to login...");
            setTimeout(() => {
                navigate("/login?verified=true"); // Redirect with query parameter
            }, 3000);

        } catch (error) {
            console.error("Verification error:", error);
            setMessage("Verification failed. Please try again.");
        }
    };

    useEffect(() => {
        console.log("Extracting verification data...");
        const encryptedData = searchParams.get("data");

        if (!encryptedData) {
            setMessage("Invalid verification link.");
            return;
        }

        if (!hasVerified.current) { // Only run if not already verified
            hasVerified.current = true;
            verifyEmail(encryptedData);
        }
    }, [searchParams]);

    return (
        <div className="verify-email-container">
            <p className="verify-email-message">{message}</p>
        </div>
    );
};

export default VerifyEmail;