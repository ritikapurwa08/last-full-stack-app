import { LucideIcon, TestTube2Icon, UserIcon } from "lucide-react";
import { IconType } from "react-icons";
import { GrAnnounce } from "react-icons/gr";
import { TbRegistered, TbSmartHome } from "react-icons/tb";

export type NavLinksType = {
  label: string;
  href: string;
  icon?: IconType | LucideIcon;
};
export const NavigationLinks: NavLinksType[] = [
  {
    label: "Home",
    href: "/",
    icon: TbSmartHome,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: UserIcon,
  },
  {
    label: "Blogs",
    href: "/blogs",
    icon: GrAnnounce,
  },
  {
    label: "Test",
    href: "/test",
    icon: TestTube2Icon,
  },
];
