import { ref, get } from "firebase/database";
import { db } from '../../../shared/initFirebase.js';
import { createDailyChallengeProblem } from "../controllers/challengeController.js";

function getRandomItems(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export const generateDailyChallenges = async () => {
  const problemsRef = ref(db, "problems");
  const today = new Date().toISOString().split("T")[0];

  try {
    const snapshot = await get(problemsRef);
    if (!snapshot.exists()) return;

    const allProblems = Object.values(snapshot.val()).filter((p) => p.verified);
    const selectedProblems = getRandomItems(allProblems, 3);

    for (const problem of selectedProblems) {
      await createDailyChallengeProblem(problem, today);
    }

    console.log(`✅ 3 daily challenge problems added for ${today}`);
  } catch (err) {
    console.error("Error generating daily challenges:", err);
  }
};