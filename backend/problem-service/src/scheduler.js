import cron from "node-cron";
import { generateDailyChallenges } from "./utils/generateDailyChallenge";

// Every day at 12:00 AM
cron.schedule("0 0 * * *", async () => {
  console.log("⏰ Running scheduled daily challenge generator...");
  await generateDailyChallenges();
});
