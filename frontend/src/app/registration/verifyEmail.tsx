import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { completeRegistration } from "./verifyEmailApi";

const VerifyEmail: React.FC = () => {
    const [message, setMessage] = useState("Verifying email...");
    const [searchParams] = useSearchParams();

    const verifyEmail = async (encryptedData: string) => {
        try {
            const data = await completeRegistration(encryptedData);
            if (data.error) {
                throw new Error(data.error);
            }

            setMessage("Email verified! Redirecting to login...");
            setTimeout(() => {
                window.location.href = "/login";
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

        // ✅ Call `verifyEmail` directly
        verifyEmail(encryptedData);
    }, [searchParams]);

    return (
        <div>
            <h1>{message}</h1>
        </div>
    );
};

export default VerifyEmail;
