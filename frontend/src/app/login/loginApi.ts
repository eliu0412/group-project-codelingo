export const API_BASE_URL = "http://localhost:8081/api/auth";

export const loginUser = async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    return response.json();
};

export const resetPassword = async (oobCode: string, newPassword: string) => {
    const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oobCode, newPassword }),
    });
    return response.json();
};