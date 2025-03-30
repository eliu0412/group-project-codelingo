import { config } from "../../config.ts";
const { prob } = config.api;

export const getDailyChallenge = async () => {
  try {
    const response = await fetch(`${prob}/problems/get-challenge`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to generate problem");
    }

    return response.json();
  } catch (err) {
    throw new Error("Failed to generate problem");
  }
};