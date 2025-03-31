import { config } from "../../config.ts";
const { prob } = config.api;

export const getDailyChallenge = async () => {
  try {
    console.log("getDailyChallenge");
    const response = await fetch(`${prob}/problems/get-challenge`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // credentials: "include",
    });
    console.log(response);
    if (!response.ok) {
      throw new Error("Failed to generate problem");
    }

    return response.json();
  } catch (err) {
    throw new Error("Failed to generate problemassadas");
  }
};