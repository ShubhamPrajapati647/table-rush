import {
  ArrowLeftRight,
  Gift,
  Hand,
  Mic,
  Music,
  PartyPopper,
  Percent,
  Pizza,
  Plus,
  Repeat,
  SkipForward,
  Sparkles,
  Swords,
  Camera,
  Ticket,
  UtensilsCrossed,
  CupSoda,
  IceCreamCone,
  ListOrdered,
  type LucideIcon,
} from "lucide-react";

/**
 * TABLE RUSH — a physical table card game.
 * All game-support text lives here so the official instructions can be updated in one place.
 * Anything not yet officially defined uses TO_BE_UPDATED rather than invented numbers.
 */

export const TO_BE_UPDATED = "Official TABLE RUSH rule — to be updated.";

export const GAME_TAGLINE = "TABLE RUSH — A Physical Table Card Game";

export const HOW_TO_PLAY: { step: string; text: string }[] = [
  { step: "Get the TABLE RUSH cards", text: "Use the physical TABLE RUSH card deck provided at your table." },
  { step: "Shuffle the cards", text: "Shuffle the deck properly before starting." },
  { step: "Deal the cards", text: "Deal cards according to the official TABLE RUSH game instructions." },
  { step: "Start the game", text: "Players take turns according to the official game rules." },
  { step: "Play your card", text: "Follow the instructions printed on the card you play." },
  { step: "Take the challenge", text: "If a Challenge Card is played, complete the challenge printed on it." },
  { step: "Use rewards", text: "If a Reward Card is activated, follow the reward conditions printed on the card." },
  { step: "Finish", text: "The game ends according to the official TABLE RUSH Game Rules." },
];

export type CardCategoryKey = "food" | "action" | "challenge" | "reward" | "special";

export type GameCardCategory = {
  key: CardCategoryKey;
  name: string;
  icon: LucideIcon;
  description: string;
  /** Tailwind classes using theme tokens for the card face. */
  tone: string;
  note?: string;
  cards: { name: string; icon: LucideIcon; text: string }[];
};

export const CARD_CATEGORIES: GameCardCategory[] = [
  {
    key: "food",
    name: "Food Cards",
    icon: UtensilsCrossed,
    tone: "from-primary to-orange",
    description: "Food Cards represent food items and are used as part of TABLE RUSH gameplay.",
    note: "A Food Card only gives a free item or discount if that specific card officially says so.",
    cards: ["Pizza", "Burger", "Biryani", "Dosa", "Momos", "Pasta", "Fries", "Ice Cream"].map((name) => ({
      name,
      icon: name === "Ice Cream" ? IceCreamCone : Pizza,
      text: "A food card from the TABLE RUSH deck.",
    })),
  },
  {
    key: "action",
    name: "Action Cards",
    icon: Sparkles,
    tone: "from-teal to-secondary",
    description: "Action Cards change or affect the flow of the game.",
    cards: [
      { name: "Skip", icon: SkipForward, text: "The next player misses their turn." },
      { name: "Reverse", icon: Repeat, text: "The direction of play changes." },
      { name: "+2", icon: Plus, text: "The next player picks up two cards." },
      { name: "Swap", icon: ArrowLeftRight, text: "Swap cards with another player." },
      { name: "Steal", icon: Hand, text: "Take a card from another player." },
    ],
  },
  {
    key: "challenge",
    name: "Challenge Cards",
    icon: Swords,
    tone: "from-orange to-secondary",
    description: "Challenge Cards create fun activities between the people at the table.",
    cards: [
      { name: "Tell a Joke", icon: Mic, text: "Make the table laugh." },
      { name: "Name 5", icon: ListOrdered, text: "Name five things in the category given." },
      { name: "Selfie Time", icon: Camera, text: "Take a table selfie together." },
      { name: "Song Line", icon: Music, text: "Sing a line from a song." },
    ],
  },
  {
    key: "reward",
    name: "Reward Cards",
    icon: Gift,
    tone: "from-gold to-primary",
    description: "Reward Cards can give a reward when their printed conditions are met.",
    note: "Rewards are only official when the physical card and the venue's terms define them. Not every restaurant or café honours every reward.",
    cards: [
      { name: "Free Dessert", icon: IceCreamCone, text: "Conditions as printed on the card." },
      { name: "10% Off", icon: Percent, text: "Conditions as printed on the card." },
      { name: "Free Soft Drink", icon: CupSoda, text: "Conditions as printed on the card." },
      { name: "Lucky Draw", icon: Ticket, text: "Conditions as printed on the card." },
      { name: "Special Treat", icon: PartyPopper, text: "Conditions as printed on the card." },
    ],
  },
  {
    key: "special",
    name: "Special Cards",
    icon: Sparkles,
    tone: "from-ink to-secondary",
    description: "Unique TABLE RUSH cards with special gameplay functions.",
    note: "Special Cards will be listed here once they are officially defined in the TABLE RUSH card design.",
    cards: [],
  },
];

export const GAME_RULES: { title: string; rules: string[] }[] = [
  { title: "Players", rules: [TO_BE_UPDATED] },
  { title: "Objective", rules: [TO_BE_UPDATED] },
  { title: "Setup", rules: ["Shuffle the TABLE RUSH deck before starting.", TO_BE_UPDATED] },
  { title: "Turn Order", rules: ["Players take turns in order.", TO_BE_UPDATED] },
  { title: "Card Usage", rules: ["Follow the instructions printed on each card you play."] },
  { title: "Food Cards", rules: ["Used as part of gameplay.", TO_BE_UPDATED] },
  { title: "Action Cards", rules: ["Apply the action printed on the card: Skip, Reverse, +2, Swap or Steal."] },
  { title: "Challenge Cards", rules: ["Complete the challenge printed on the card.", TO_BE_UPDATED] },
  {
    title: "Reward Cards",
    rules: ["Rewards follow the conditions printed on the card and the venue's own terms."],
  },
  { title: "Special Cards", rules: [TO_BE_UPDATED] },
  { title: "Ending the Game", rules: [TO_BE_UPDATED] },
  { title: "General Rules", rules: ["Keep the cards clean and hand the deck back to staff when you're done."] },
  { title: "Fair Play", rules: ["Play kindly, respect other customers and have fun together."] },
];

export const SUPPORT_EMAIL = "supporttablerush@gmail.com";
