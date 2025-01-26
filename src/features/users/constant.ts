import { LucideIcon, TestTube2Icon, UserIcon } from "lucide-react";
import { IconType } from "react-icons";
import { GrAnnounce } from "react-icons/gr";
import { TbSmartHome } from "react-icons/tb";
import { Id } from "../../../convex/_generated/dataModel";

export type NavLinksType = {
  label: string;
  href: string;
  icon?: IconType | LucideIcon;
};
