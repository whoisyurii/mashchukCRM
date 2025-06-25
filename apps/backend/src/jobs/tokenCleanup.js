import cron from "node-cron";
import { cleanExpiredTokens } from "../utils/tokenUtils.js";

/**
 * Scheduled task to clean up expired refresh tokens
 * Runs every day at midnight
 */
export const startTokenCleanupJob = () => {
  // Run every day at midnight (0 0 * * *)
  cron.schedule("0 0 * * *", async () => {
    try {
      await cleanExpiredTokens();
    } catch (error) {
      console.error("Error during token cleanup:", error);
    }
  });
};

// Manual cleanup function for testing
export const runTokenCleanup = async () => {
  try {
    await cleanExpiredTokens();
  } catch (error) {
    console.error("Error during manual token cleanup:", error);
  }
};
