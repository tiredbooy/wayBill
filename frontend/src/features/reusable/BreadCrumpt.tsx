import { Link, useLocation } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Fragment } from "react";

interface BreadcrumbProps {
  labelMap?: Record<string, string>;
  items?: { label: string; href?: string }[];
  className?: string;
}

export function Breadcrumb({
  labelMap = {},
  className,
}: BreadcrumbProps) {
  const location = useLocation();
  const pathname = location.pathname;

  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label =
      labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

    return { label, href };
  });

  return (
    <nav
      dir="rtl"
      aria-label="Breadcrumb"
      className={cn("flex items-center text-sm", className)}
    >
      <Link
        to="/"
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        خانه
      </Link>

      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;

        return (
          <Fragment key={crumb.href}>
            <ChevronLeft className="mx-2 h-4 w-4 text-muted-foreground" />

            {isLast ? (
              <span className="font-medium text-foreground">{crumb.label}</span>
            ) : (
              <Link
                to={crumb.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
