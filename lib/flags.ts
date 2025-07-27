import { flag } from "@vercel/flags/next";

export const comingSoonFlag = flag({
  key: "coming-soon",
  decide: () => {
    try {
      return process.env.COMING_SOON_FLAG === "1";
    } catch (error) {
      console.error("Error checking coming-soon flag:", error);
      return false;
    }
  },
});

export const underConstructionFlag = flag({
  key: "under-construction",
  decide: () => {
    try {
      return process.env.UNDER_CONSTRUCTION_FLAG === "1";
    } catch (error) {
      console.error("Error checking under-construction flag:", error);
      return false;
    }
  },
});
