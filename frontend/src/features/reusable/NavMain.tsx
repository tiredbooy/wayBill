import { ChevronRight } from "lucide-react";
import { useLocation, Link } from "react-router-dom"; // ← assuming react-router

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import type { NavItem } from "./NavItems";

const DASHBOARD_BASE = "/dashboard";

function resolveUrl(url: string) {
  if (url.startsWith("/")) return url;
  return `${DASHBOARD_BASE}/${url}`;
}

function isPathActive(pathname: string, url: string) {
  // Dashboard root should ONLY be active on exact match
  if (url === "/dashboard") {
    return pathname === "/dashboard";
  }

  return pathname === url || pathname.startsWith(`${url}/`);
}

export function NavMain({ items }: { items: NavItem[] }) {
  const { pathname } = useLocation();

  return items.map((item) => {
    const itemUrl = resolveUrl(item.url);

    const isActive =
      isPathActive(pathname, itemUrl) ||
      item.items?.some((sub) => isPathActive(pathname, resolveUrl(sub.url)));

    if (item.items?.length) {
      return (
        <Collapsible key={item.title} asChild defaultOpen={isActive}>
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={item.title} isActive={isActive}>
                {item.icon && <item.icon className="h-5 w-5" />}
                <span>{item.title}</span>
                <ChevronRight className="ml-auto transition-transform group-data-[state=open]:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <SidebarMenuSub>
                {item.items.map((sub) => {
                  const subUrl = resolveUrl(sub.url);
                  const subActive = isPathActive(pathname, subUrl);

                  return (
                    <SidebarMenuSubItem key={sub.title}>
                      <SidebarMenuSubButton asChild isActive={subActive}>
                        <Link to={subUrl}>
                          <span>{sub.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  );
                })}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      );
    }

    return (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton asChild tooltip={item.title} isActive={isActive}>
          <Link to={itemUrl}>
            {item.icon && <item.icon className="h-5 w-5" />}
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  });
}
