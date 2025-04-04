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

export const getLeaderboard = async () => {
  try {
    const response = await fetch(`${prob}/problems/get-leaderboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch leaderboard data");
    }
    const data = await response.json();
    return data;
  } catch (err) {
    throw new Error("Failed to fetch leaderboard data");
  }
};

export const getUserScore = async (data: { uid: string; }) => {
  try {
    console.log(data);
    const response = await fetch(`${prob}/problems/get-user-score`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch user score data");
    }
    const userScore = await response.json();
    return userScore;
  } catch (err) {
    throw new Error("Failed to fetch user score data");
  }
};