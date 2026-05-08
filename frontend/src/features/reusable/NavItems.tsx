import type { IconType } from "react-icons";
import {
  MdCarCrash,
  MdLocationPin,
  MdOutlineDashboard,
  MdPeople,
  MdPeopleOutline,
  MdSettings
} from "react-icons/md";
import { RiContractLine } from "react-icons/ri";

export interface NavItem {
  title: string;
  url: string;
  icon?: IconType;
  isActive?: boolean;
  items?: NavItem[];
}

export const navMain: NavItem[] = [
  {
    title: "داشبورد",
    url: "/dashboard",
    icon: MdOutlineDashboard,
  },
  {
    title: "بارنامه",
    url: "waybills",
    icon: RiContractLine,
  },
  {
    title: "رانندگان",
    url: "drivers",
    icon: MdPeopleOutline,
  },
  {
    title: "خودروها",
    url: "vehicles",
    icon: MdCarCrash,
  },
  {
    title: "مشتری ها",
    url: "customers",
    icon: MdPeople,
  },
  {
    title: "مکان ها",
    url: "locations",
    icon: MdLocationPin,
  },
  {
    title: "تنظیمات",
    url: "settings",
    icon: MdSettings,
  },
];
