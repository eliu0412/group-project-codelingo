import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase"; // Adjust path to firebase.js
import { sendPasswordResetEmail } from "firebase/auth"; // Explicitly import the method
import background from "../../assets/landing.jpg";

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);

        try {
            await sendPasswordResetEmail(auth, email); // Use the imported function
            setMessage("Password reset email has been sent. Check your inbox.");
            setTimeout(() => navigate("/login"), 3000);
        } catch (error) {
            setError("Failed to send reset email.");
            console.error("Forgot password error:", error);
        }
    };

    return (
        <div
            style={{
                backgroundImage: `url(${background})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                height: "100vh",
                width: "100%",
            }}
            className="flex flex-col justify-center items-center"
        >
            <div className="login-container">
                <form className="login-form" onSubmit={handleSubmit}>
                    <h2>Forgot Password</h2>
                    {message && <p className="success">{message}</p>}
                    {error && <p className="error">{error}</p>}

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit">Send Reset Link</button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;