export const API_BASE_URL = "http://localhost:8081/api/auth";

export const completeRegistration = async (encryptedData: string) => {
    const response = await fetch("http://localhost:8081/api/auth/complete-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ encryptedData }),
    });

    return response.json();
};