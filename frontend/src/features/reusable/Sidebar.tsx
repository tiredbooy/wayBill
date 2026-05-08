import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
} from "@/components/ui/sidebar";
import type { ComponentProps } from "react";
import { navMain } from "./NavItems";
import { NavMain } from "./NavMain";
import logo from "@/assets/company-logo.png";

export default function Sidebar({
  ...props
}: ComponentProps<typeof SidebarComponent>) {
  return (
    <SidebarComponent
      collapsible="icon"
      className="border-r"
      {...props}
      side="right"
    >
      <SidebarHeader>
        {/* Your logo / app name */}
        <div className="flex items-center gap-2 px-4 py-3">
          {/* <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="font-semibold">A</span>
          </div>
          <div className="grid flex-1 text-right text-sm leading-tight">
            <span className="truncate font-semibold">سافت دش</span>
            <span className="truncate text-xs">مهدی کاظمی</span>
          </div> */}
          <img src={logo} alt="company Logo" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <NavMain items={navMain} />
            {/* <NavSecondary items={navSecondary} className="mt-6" /> */}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* <SidebarFooter>
        <NavUser />
      </SidebarFooter> */}

      <SidebarRail />
    </SidebarComponent>
  );
}
