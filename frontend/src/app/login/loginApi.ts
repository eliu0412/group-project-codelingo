export const API_BASE_URL = "http://localhost:8080/api/auth";

export const loginUser = async (
    email: string,
    password: string
): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    return response.json();
};