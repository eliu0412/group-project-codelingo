import React, { useState } from "react";
import { registerUser } from "./registrationApi";
import "./registrationPage.css"; // Import the CSS file

const Register: React.FC = () => {
    const [form, setForm] = useState({
        email: "",
        password: "",
        username: ""
    });

    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setError(null);
        try {
            const response = await registerUser(form.email, form.password, form.username);
            if (response.message) {
                setError(response.message);
            } else {
                setMessage(response.message);
            }
        } catch (error) {
            setError((error as Error).message);
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit} className="register-form">
                <input
                    name="username"
                    placeholder="Username"
                    onChange={handleChange}
                    required
                />
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    onChange={handleChange}
                    required
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={handleChange}
                    required
                />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
