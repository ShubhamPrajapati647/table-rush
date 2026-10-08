import {
  BarChart3,
  Building2,
  Coffee,
  CreditCard,
  Gamepad2,
  LayoutDashboard,
  LifeBuoy,
  Mail,
  QrCode,
  ReceiptText,
  Settings,
  Store,
  Table2,
  UsersRound,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

export type SectionMeta = {
  label: string;
  title: string;
  description: string;
  icon: LucideIcon;
  emptyTitle: string;
  emptyDescription: string;
};

export const SECTIONS: Record<string, SectionMeta> = {
  orders: {
    label: "Orders",
    title: "Orders",
    description: "Live and past orders placed from your tables.",
    icon: ReceiptText,
    emptyTitle: "No orders yet",
    emptyDescription: "Orders will appear here as soon as customers start ordering from a table.",
  },
  tables: {
    label: "Tables",
    title: "Tables",
    description: "Manage your seating and the QR code linked to each table.",
    icon: Table2,
    emptyTitle: "No tables added yet",
    emptyDescription: "Add your tables to generate the QR codes customers scan to order.",
  },
  "qr-codes": {
    label: "QR Codes",
    title: "QR codes",
    description: "View, download and print the QR code for every table.",
    icon: QrCode,
    emptyTitle: "No QR codes yet",
    emptyDescription: "Add tables first — each table gets its own QR code automatically.",
  },

  menu: {
    label: "Menu",
    title: "Menu",
    description: "Categories, items and add-ons customers can order.",
    icon: UtensilsCrossed,
    emptyTitle: "Your menu is empty",
    emptyDescription: "Create categories and items so customers can browse and order.",
  },
  payments: {
    label: "Payments",
    title: "Payments",
    description: "Online and counter payments collected through Table Rush.",
    icon: CreditCard,
    emptyTitle: "No payments recorded",
    emptyDescription: "Payments will be listed here once orders start coming in.",
  },
  customers: {
    label: "Customers",
    title: "Customers",
    description: "Customers who have ordered with you.",
    icon: UsersRound,
    emptyTitle: "No customers yet",
    emptyDescription: "Customer records are created automatically after their first order.",
  },
  reports: {
    label: "Reports",
    title: "Reports",
    description: "Sales, tables and menu performance.",
    icon: BarChart3,
    emptyTitle: "No data to report yet",
    emptyDescription: "Reports become available after your first orders are completed.",
  },
  "game-support": {
    label: "Game Support",
    title: "Game support",
    description: "How to play, card types and game rules for the TABLE RUSH card game.",
    icon: Gamepad2,
    emptyTitle: "TABLE RUSH card game",
    emptyDescription: "A physical card game for the table.",
  },
  contact: {
    label: "Contact",
    title: "Contact Table Rush",
    description: "Reach the Table Rush team.",
    icon: Mail,
    emptyTitle: "Support inbox coming soon",
    emptyDescription: "Messaging the Table Rush team from the dashboard will be enabled here.",
  },
  settings: {
    label: "Settings",
    title: "Settings",
    description: "Business profile, opening hours and account settings.",
    icon: Settings,
    emptyTitle: "Settings coming soon",
    emptyDescription: "Editable business details and staff management land here next.",
  },
  restaurants: {
    label: "Restaurants",
    title: "Restaurants",
    description: "Every restaurant registered on the platform.",
    icon: Store,
    emptyTitle: "No restaurants registered",
    emptyDescription: "Restaurants appear here after they register and await approval.",
  },
  cafes: {
    label: "Cafés",
    title: "Cafés",
    description: "Every café registered on the platform.",
    icon: Coffee,
    emptyTitle: "No cafés registered",
    emptyDescription: "Cafés appear here after they register and await approval.",
  },
  "business-directory": {
    label: "Business Directory",
    title: "Business directory",
    description: "Mumbai discovery listings and provider synchronisation.",
    icon: Building2,
    emptyTitle: "No listings yet",
    emptyDescription: "Connect the business directory provider to import Mumbai listings.",
  },
  support: {
    label: "Support",
    title: "Support",
    description: "Support requests from businesses and customers.",
    icon: LifeBuoy,
    emptyTitle: "No support requests",
    emptyDescription: "Incoming requests will be listed here.",
  },
  home: {
    label: "Home",
    title: "Overview",
    description: "Your workspace at a glance.",
    icon: LayoutDashboard,
    emptyTitle: "Nothing to show yet",
    emptyDescription: "Your activity will appear here once your venue goes live.",
  },
};

export function getSection(slug: string): SectionMeta | null {
  return SECTIONS[slug] ?? null;
}
