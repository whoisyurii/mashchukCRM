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
      console.log("🧹 Starting expired token cleanup...");
      await cleanExpiredTokens();
      console.log("✅ Expired token cleanup completed");
    } catch (error) {
      console.error("❌ Error during token cleanup:", error);
    }
  });

  console.log("📅 Token cleanup job scheduled to run daily at midnight");
};

// Manual cleanup function for testing
export const runTokenCleanup = async () => {
  try {
    console.log("🧹 Running manual token cleanup...");
    await cleanExpiredTokens();
    console.log("✅ Manual token cleanup completed");
  } catch (error) {
    console.error("❌ Error during manual token cleanup:", error);
  }
};
