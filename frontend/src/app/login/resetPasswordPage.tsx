import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "./loginApi";
import background from "../../assets/landing.jpg";

const ResetPassword: React.FC = () => {
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);

        const oobCode = searchParams.get("oobCode");
        if (!oobCode) {
            setError("Invalid reset link. Missing oobCode.");
            return;
        }

        try {
            const response = await resetPassword(oobCode, newPassword);
            if (response.error) {
                throw new Error(response.error);
            }
            setMessage(response.message);
            setTimeout(() => navigate("/login"), 3000);
        } catch (error) {
            setError("Error resetting password.");
            console.error("Reset password error:", error);
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
                    <h2>Reset Password</h2>
                    {message && <p className="success">{message}</p>}
                    {error && <p className="error">{error}</p>}

                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Reset Password</button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;