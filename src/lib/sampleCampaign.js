export const sampleForm = {
  appName: "PlateUp",
  appDescription:
    "PlateUp turns whatever's already in your fridge into a full week of dinners in under 5 minutes - no meal-planning marathon, no extra grocery run.",
  appLink: "",
  targetUser: "Busy parents who want quick, healthy dinner ideas but do not have time for elaborate meal planning",
  tone: "Authentic",
  appCategory: "Food & Nutrition",
  keyFeatures: ["Fridge ingredient scan", "7-day meal plan", "Picky eater filters"],
  launchStage: "Just launched"
};

export const samplePersona = {
  name: "Jessica",
  age: 37,
  role: "Working mom",
  dailyRoutine:
    "She rushes to get her kids to school, works a 9-to-5 job, then scrambles to get dinner on the table, often relying on takeout or leftovers.",
  frustration:
    "She hates staring blankly into the fridge, wondering what she can make with what is on hand, and feels guilty resorting to unhealthy or expensive takeout.",
  platforms: ["Facebook", "Pinterest", "Instagram", "Allrecipes"],
  trustTriggers: "Trusts a recommendation from a fellow parent or dietitian more than an ad.",
  scrollStopPower: 8,
  traits: ["practical", "health-conscious", "time-pressed", "resourceful"]
};

export const sampleScenes = `Jessica is scrolling Facebook during her lunch break when she sees a testimonial post from a busy mom about planning a week of dinners in under 5 minutes. The before-and-after fridge photos catch her eye - she clicks to learn more.
---SCENE---
Jessica is browsing Pinterest for healthy dinner ideas and stumbles on a Pin from a dietitian recommending the app. The photo of a meal made from leftovers grabs her attention, and she clicks through to the site.
---SCENE---
Jessica sees a trusted mom-influencer's Instagram post raving about the app turning fridge leftovers into a week of dinners. She taps the link in the bio to download it.`;

export const sampleContent = {
  reddit:
    "r/busycooking\nI have been struggling to figure out dinners for my family after work and stumbled on this app. It has been a lifesaver - I can plan a week of dinners using what I already have in the fridge in a few minutes. No more staring blankly wondering what to make. Anyone else tried it?",
  producthunt:
    "Tagline: Your fridge already has dinner in it\n\nMaker's comment: I built this after one too many nights staring into an open fridge with two hungry kids behind me. It scans what you already have and builds a real week of dinners in under 5 minutes. No extra grocery trip required.\n\nFAQ:\n- Q: Do I have to enter every ingredient?\n  A: No, rough inventory is enough and the app fills gaps.\n- Q: Does it handle picky eaters?\n  A: You can flag dislikes and it adapts.\n- Q: Is there a free plan?\n  A: Yes, one meal plan per week is free.",
  xthread:
    "1/5 I kept ordering takeout because dinner planning after work was chaos.\n2/5 Built PlateUp to scan what is already in your fridge and turn it into a week of meals.\n3/5 Parents testing it said the best part was no extra grocery run on weeknights.\n4/5 Still rough around the edges, but it is already saving me 45+ minutes every evening.\n5/5 If dinner planning drains your nights, DM me and I will share early access.",
  video:
    "1. Open on a cluttered, half-empty fridge. Caption: 'What is actually in there?'\n2. Cut to phone screen scanning fridge contents. Caption: 'Takes 90 seconds.'\n3. Show a 7-day dinner plan appearing. Caption: 'A full week. Zero new groceries.'\n4. Show a finished plated meal. Caption: 'Dinner, solved.'\n5. End card with app icon. Caption: 'Try it tonight.'"
};

export const sampleCritiques = {
  reddit: {
    score: 9,
    verdict: "I would try this after reading it - it sounds like a fix for my weeknights.",
    fix: "None - this lands.",
    dimensions: {
      authenticity: 9,
      conversionPotential: 8
    }
  },
  producthunt: {
    score: 7,
    verdict: "Tagline is good, but one FAQ still sounds generic.",
    fix: "Replace one FAQ with a skeptical parent objection about food waste.",
    dimensions: {
      authenticity: 7,
      conversionPotential: 7
    }
  },
  xthread: {
    score: 8,
    verdict: "This sounds human and practical, not hypey.",
    fix: "Add one concrete stat from an early tester for stronger proof.",
    dimensions: {
      authenticity: 8,
      conversionPotential: 8
    }
  },
  video: {
    score: 8,
    verdict: "The fridge-to-plan visual is the right hook for this persona.",
    fix: "Add an on-screen timer to prove the 90-second setup claim.",
    dimensions: {
      authenticity: 8,
      conversionPotential: 8
    }
  }
};

export const sampleCalendar = {
  days: [
    {
      day: "Day 1",
      focus: "Post it yourself",
      action: "Share the before/after fridge photo in 2 relevant Facebook parenting groups you are already a member of."
    },
    {
      day: "Day 2",
      focus: "Reddit",
      action: "Post the r/busycooking draft above, then reply to every comment for the first 3 hours."
    },
    {
      day: "Day 3",
      focus: "DM 5 micro-creators",
      action: "Message 5 parenting TikTok/Instagram accounts under 20k followers offering free access for an honest review."
    },
    {
      day: "Day 4",
      focus: "Product Hunt",
      action: "Launch with the tagline and maker's comment above; ask 10 friends to upvote in the first hour."
    },
    {
      day: "Day 5",
      focus: "Listen and reply",
      action: "Read every comment/DM from the last 4 days, and fix the most-mentioned complaint before posting again."
    },
    {
      day: "Day 6",
      focus: "Short-form video",
      action: "Post the 15-second script as a Reel and TikTok on the same day with one clear CTA."
    },
    {
      day: "Day 7",
      focus: "Recap post",
      action: "Share early numbers and one user quote in the same communities from Day 1."
    }
  ],
  firstUserActions: [
    "DM 10 warm contacts for first installs",
    "Reply to every launch comment within 10 minutes",
    "Share a short before/after demo clip on X",
    "Ask 3 early users for public testimonials"
  ]
};
