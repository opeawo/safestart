// Walkthrough content for the six platforms in PRD §9.2.
// Per F3.1 these would normally come from a CMS (Sanity). For v0.3 we
// inline them; product team can replace with a Sanity fetch later.

import type { Lang } from "../i18n/strings";

export type Step = {
  title: string;
  body: string;          // ≤ ~25 words per F3.2
  illustration?: string; // emoji or simple icon string
  // Optional: override the auto-generated YouTube search query for this step.
  // If omitted, we auto-generate one from platform.name + step.title.
  videoQuery?: string;
};

export type Quiz = {
  question: string;
  options: string[];     // 3 options per F4.1
  correctIndex: number;
};

export type Platform = {
  id: string;
  name: string;
  color: string;         // brand color
  emoji: string;         // emoji fallback if logo fails to load
  domain: string;        // domain for logo.dev lookup
  estMin: number;
  intro: string;         // 30-second explainer
  wrap: string;          // 30-second wrap-up
  deepLink: string;      // attempted first per F3.3
  steps: Step[];
  quiz: Quiz;
};

export const PLATFORMS: Platform[] = [
  {
    id: "tiktok",
    name: "TikTok",
    color: "#000000",
    emoji: "🎵",
    domain: "tiktok.com",
    estMin: 3,
    intro:
      "We'll turn on Family Pairing, Restricted Mode, limit who can message your child, and switch off personalised ads.",
    wrap:
      "TikTok now hides mature content and limits messages. Your child can still watch and post — they're just safer while doing it.",
    deepLink: "tiktok://settings",
    steps: [
      {
        title: "Open the TikTok app",
        body: "Tap the button below. We'll bring you straight to the Settings screen.",
        illustration: "🎵",
      },
      {
        title: "Tap Profile, then the three lines",
        body: "Top-right corner of the profile screen. Choose Settings and privacy.",
        illustration: "👤",
      },
      {
        title: "Turn on Restricted Mode",
        body: "Settings → Content preferences → Restricted Mode. Set a 4-digit code so your child can't switch it off.",
        illustration: "🔒",
      },
      {
        title: "Set messages to Friends only",
        body: "Settings → Privacy → Direct messages → choose Friends. This stops strangers DMing your child.",
        illustration: "✉️",
      },
      {
        title: "Switch off personalised ads",
        body: "Settings → Ads → turn Personalised ads off. Reduces creepy targeting.",
        illustration: "🚫",
      },
      {
        title: "Set up Family Pairing",
        body: "Settings → Family Pairing → I'm a parent → scan the QR code on your child's phone.",
        illustration: "👨‍👧",
      },
    ],
    quiz: {
      question: "After you turned on Restricted Mode, what did the screen show?",
      options: [
        "A 4-digit passcode prompt",
        "A list of your contacts",
        "A live video feed",
      ],
      correctIndex: 0,
    },
  },
  {
    id: "instagram",
    name: "Instagram",
    color: "#E4405F",
    emoji: "📸",
    domain: "instagram.com",
    estMin: 3,
    intro:
      "We'll switch the account to Teen, make it private, restrict messages to followers only, and limit sensitive content.",
    wrap:
      "Instagram now treats your child as a teen — private account, restricted DMs, less sensitive content. They can still post and follow friends.",
    deepLink: "instagram://settings",
    steps: [
      {
        title: "Open Instagram Settings",
        body: "Tap the button below. If it doesn't open, open Instagram and tap Profile → three lines → Settings.",
        illustration: "📸",
      },
      {
        title: "Switch to Teen Account",
        body: "Settings → Account → Switch to Teen. Instagram will apply the right defaults automatically.",
        illustration: "🧑",
      },
      {
        title: "Set account to Private",
        body: "Settings → Privacy → Account privacy → turn on Private account.",
        illustration: "🔐",
      },
      {
        title: "Sensitive content set to Less",
        body: "Settings → Content preferences → Sensitive content control → choose Less.",
        illustration: "👁️",
      },
      {
        title: "Restrict direct messages",
        body: "Settings → Messages and story replies → Message controls → set 'From everyone' to Followers only.",
        illustration: "💬",
      },
      {
        title: "Lock down tagging and stories",
        body: "Settings → Tags and mentions → Allow tags from People you follow only. Stories → close friends only.",
        illustration: "🏷️",
      },
    ],
    quiz: {
      question: "After switching to Teen Account, what did Instagram say?",
      options: [
        "Your account is now private and DMs are limited",
        "You unlocked a new sticker pack",
        "Your followers were deleted",
      ],
      correctIndex: 0,
    },
  },
  {
    id: "youtube",
    name: "YouTube",
    color: "#FF0000",
    emoji: "▶️",
    domain: "youtube.com",
    estMin: 2,
    intro:
      "We'll turn on Restricted Mode and — for younger kids — switch to YouTube Kids with the right age level.",
    wrap:
      "YouTube now filters out most adult content. For under-13s use YouTube Kids; for teens, Restricted Mode handles most of it.",
    deepLink: "youtube://settings",
    steps: [
      {
        title: "Open YouTube Settings",
        body: "Tap the button below. Or open YouTube → Profile → Settings.",
        illustration: "▶️",
      },
      {
        title: "Turn on Restricted Mode",
        body: "Settings → General → Restricted Mode → toggle on.",
        illustration: "🔒",
      },
      {
        title: "For under-13: install YouTube Kids",
        body: "Search for YouTube Kids in the Play Store. Pick the right age level (Preschool / Younger / Older).",
        illustration: "👶",
      },
      {
        title: "Turn off Watch History (optional)",
        body: "Settings → History & privacy → Pause watch history. Reduces the algorithm pulling them deeper.",
        illustration: "🕐",
      },
    ],
    quiz: {
      question: "When Restricted Mode is on, what happens to mature videos?",
      options: [
        "They are filtered from search and recommendations",
        "They play with extra ads",
        "They become free to download",
      ],
      correctIndex: 0,
    },
  },
  {
    id: "snapchat",
    name: "Snapchat",
    color: "#FFFC00",
    emoji: "👻",
    domain: "snapchat.com",
    estMin: 3,
    intro:
      "We'll link your child to Family Center, hide their location, switch off Quick Add, and lock who can contact them.",
    wrap:
      "Snapchat now hides your child's location and limits contact to friends. You can see who they're talking to via Family Center.",
    deepLink: "snapchat://family_center",
    steps: [
      {
        title: "Open Snapchat Family Center",
        body: "Tap the button below. Or in Snapchat: Profile → Settings → Family Center.",
        illustration: "👻",
      },
      {
        title: "Link your child via QR code",
        body: "On YOUR phone, install Snapchat too. Open Family Center → Add a family member → scan the code on the child's phone.",
        illustration: "📱",
      },
      {
        title: "Set location to Ghost Mode",
        body: "Settings → See My Location → Ghost Mode. Stops the Snap Map showing where the child is.",
        illustration: "📍",
      },
      {
        title: "Turn off Quick Add",
        body: "Settings → See me in Quick Add → toggle off. Stops random people finding the account.",
        illustration: "➕",
      },
      {
        title: "Lock contact and story to Friends",
        body: "Settings → Contact Me → Friends. Settings → View My Story → Friends.",
        illustration: "👥",
      },
    ],
    quiz: {
      question: "After Ghost Mode is on, who can see your child's location?",
      options: [
        "Nobody",
        "Everyone they have ever added",
        "Snapchat staff only",
      ],
      correctIndex: 0,
    },
  },
  {
    id: "roblox",
    name: "Roblox",
    color: "#E2231A",
    emoji: "🎮",
    domain: "roblox.com",
    estMin: 3,
    intro:
      "We'll turn on Account Restrictions, set a parental PIN, and lock chat to friends only.",
    wrap:
      "Roblox now limits the games your child can play, requires a PIN to change settings, and restricts who can chat with them.",
    deepLink: "https://www.roblox.com/my/account#!/privacy",
    steps: [
      {
        title: "Open Roblox in a browser",
        body: "Tap the button below. Roblox doesn't always honour app deep links, so we use the website.",
        illustration: "🎮",
      },
      {
        title: "Sign in with the child's account",
        body: "Use the child's username and password. You won't need to share these with anyone.",
        illustration: "🔑",
      },
      {
        title: "Set a 4-digit Account PIN",
        body: "Settings → Security → Account PIN → set a code only you know. Without it, settings can't be changed.",
        illustration: "🔢",
      },
      {
        title: "Turn on Account Restrictions",
        body: "Settings → Privacy → toggle Account Restrictions. Limits chat, friends, and the games available.",
        illustration: "🛡️",
      },
      {
        title: "Set chat to Friends or Off",
        body: "Settings → Privacy → Who can chat with me → choose Friends, or No one for very young kids.",
        illustration: "💬",
      },
    ],
    quiz: {
      question: "What does Account Restrictions do?",
      options: [
        "Limits the games, chat, and friends available to the account",
        "Speeds up the game",
        "Adds free Robux",
      ],
      correctIndex: 0,
    },
  },
  {
    id: "chrome",
    name: "Chrome",
    color: "#4285F4",
    emoji: "🌐",
    domain: "google.com",
    estMin: 3,
    intro:
      "We'll lock SafeSearch on Google, supervise Chrome with Family Link, and block sites that aren't safe for kids.",
    wrap:
      "Chrome now hides explicit results, blocks the worst sites, and lets you see — and pause — what your child browses, all from your phone.",
    deepLink: "https://families.google.com/familylink",
    steps: [
      {
        title: "Install Family Link on YOUR phone",
        body: "Search Family Link in the Play Store or App Store and install it on the parent's phone first.",
        illustration: "📲",
      },
      {
        title: "Add the child's Google account",
        body: "Open Family Link → tap + → Add a child. Sign in with the Google account on the child's phone.",
        illustration: "👨\u200d👧",
      },
      {
        title: "Turn on Chrome supervision",
        body: "Family Link → Controls → Google Chrome → choose 'Try to block explicit sites'. Lock it with your parent password.",
        illustration: "🛡️",
      },
      {
        title: "Lock SafeSearch on Google",
        body: "Family Link → Controls → Google Search → toggle SafeSearch on. This filters explicit results from every search.",
        illustration: "🔍",
      },
      {
        title: "Block specific sites (optional)",
        body: "Family Link → Chrome → Manage sites → Blocked → add any sites you don't want opened (e.g. adult sites, betting).",
        illustration: "🚫",
      },
      {
        title: "Turn off Incognito on the child's phone",
        body: "Once Chrome is supervised, Incognito mode is automatically disabled — confirm by opening Chrome on the child's phone.",
        illustration: "🕵️",
      },
    ],
    quiz: {
      question: "After Chrome is supervised with Family Link, what happens to Incognito mode?",
      options: [
        "It is automatically disabled",
        "It works the same as before",
        "It saves history to the parent's account",
      ],
      correctIndex: 0,
    },
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    color: "#25D366",
    emoji: "💬",
    domain: "whatsapp.com",
    estMin: 1,
    intro:
      "We'll lock down Last seen, profile photo, status, and group invites so strangers can't see or pull your child into groups.",
    wrap:
      "WhatsApp now hides your child's profile from strangers and stops random group adds.",
    deepLink: "whatsapp://privacy",
    steps: [
      {
        title: "Open WhatsApp Privacy",
        body: "Tap the button below. Or in WhatsApp: Settings → Privacy.",
        illustration: "💬",
      },
      {
        title: "Last seen and online → My contacts",
        body: "Privacy → Last seen and online → choose My contacts. Strangers won't see when the child is online.",
        illustration: "👁️",
      },
      {
        title: "Profile photo → My contacts",
        body: "Privacy → Profile photo → My contacts. Stops strangers grabbing the child's picture.",
        illustration: "🖼️",
      },
      {
        title: "Status → My contacts",
        body: "Privacy → Status → My contacts. Limits who sees status updates.",
        illustration: "📝",
      },
      {
        title: "Groups → My contacts",
        body: "Privacy → Groups → choose My contacts. Stops random people adding the child to groups.",
        illustration: "👥",
      },
    ],
    quiz: {
      question: "After setting Groups to My contacts, who can add your child to a group?",
      options: [
        "Only people in the child's contacts",
        "Anyone with the phone number",
        "Only WhatsApp staff",
      ],
      correctIndex: 0,
    },
  },
];

export function getPlatform(id: string): Platform | undefined {
  return PLATFORMS.find((p) => p.id === id);
}

// We carry the Lang param so that future translations can route through here
// without a callsite change. v0.3 returns English content.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getPlatforms(_lang: Lang): Platform[] {
  return PLATFORMS;
}

// Approx settings count per platform — used in celebration card.
export const SETTINGS_PER_PLATFORM: Record<string, number> = {
  tiktok: 6,
  instagram: 6,
  youtube: 4,
  snapchat: 5,
  roblox: 5,
  chrome: 6,
  whatsapp: 5,
};
