import {
  Home,
  ShoppingBag,
  Phone,
  Info,
  LayoutDashboard,
  Package,
  User,
  Settings,
  Wrench,
} from "lucide-react";

// Navigation items with icons
export const navItems = [
  {
    id: "home",
    label: "Home",
    path: "/",
    icon: Home,
  },
  {
    id: "products",
    label: "Product",
    path: "/products",
    icon: ShoppingBag,
  },
  {
    id: "contact",
    label: "Contact",
    path: "/contact",
    icon: Phone,
  },
  {
    id: "about",
    label: "About",
    path: "/about",
    icon: Info,
    // isExternalLink: true, // For using <a> instead of <Link>
  },
  {
    id: "minifig-builder",
    label: "Designer",
    icon: Wrench,
    path: "https://minifig-designer.onrender.com",
    isExternalLink: true,
  },
];

// User menu items with icons
export const userMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
    roleRequired: ["admin", "employee", "superAdmin"],
  },
  {
    id: "orders",
    label: "My Orders",
    path: "/my-orders?status=all",
    icon: Package,
  },
  {
    id: "profile",
    label: "Profile",
    path: "/profile",
    icon: User,
  },
  {
    id: "settings",
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

// Dropdown items

export const dropdownItems = [
  {
    id: "profile",
    label: "Profile",
    path: "/me/profile",
  },
  {
    id: "admin",
    label: "Admin",
    path: "/admin/dashboard",
    roleRequired: "admin",
  },
  {
    id: "logout",
    label: "Logout",
    action: "logout", // Special identifier for logout action
  },
];
