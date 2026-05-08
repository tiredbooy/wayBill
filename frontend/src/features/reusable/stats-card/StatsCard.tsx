import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { forwardRef, type HTMLAttributes } from "react";
import type { IconType } from "react-icons";
import {
  FaArrowDown,
  FaArrowUp,
  FaMinus
} from "react-icons/fa";

const statsCardVariants = cva(
  "rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-200 hover:shadow-md",
  {
    variants: {
      variant: {
        default: "border-border",
        glass: "backdrop-blur-sm bg-background/80 border-border/50",
        gradient: "border-0 bg-gradient-to-br",
        minimal: "border-border/50 bg-transparent shadow-none",
      },
      size: {
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

const gradientVariants = {
  blue: "from-blue-500/10 to-cyan-500/10",
  green: "from-emerald-500/10 to-green-500/10",
  purple: "from-purple-500/10 to-pink-500/10",
  orange: "from-orange-500/10 to-amber-500/10",
  red: "from-red-500/10 to-rose-500/10",
  indigo: "from-indigo-500/10 to-violet-500/10",
};

const iconVariants = cva("rounded-lg p-3", {
  variants: {
    variant: {
      default: "bg-primary/10 text-primary",
      glass: "bg-primary/15 text-primary",
      gradient: "bg-white/20 text-white",
      minimal: "bg-primary/5 text-primary",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface StatsCardProps
  extends
    HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statsCardVariants> {
  title: string;
  value: string | number;
  icon?: IconType;
  change?: number;
  changeLabel?: string;
  description?: string;
  loading?: boolean;
  trend?: "up" | "down" | "neutral";
  gradient?: keyof typeof gradientVariants;
  precision?: number;
  prefix?: string;
  suffix?: string;
  animation?: "none" | "fade" | "slide" | "scale";
  delay?: number;
}

const StatsCard = forwardRef<HTMLDivElement, StatsCardProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      title,
      value,
      icon: Icon,
      change,
      changeLabel,
      description,
      loading = false,
      trend,
      gradient = "blue",
      precision = 0,
      prefix = "",
      suffix = "",
      animation = "fade",
      delay = 0,
      ...props
    },
    ref,
  ) => {
    // Determine trend from change if not provided
    const calculatedTrend =
      trend ||
      (change === undefined
        ? "neutral"
        : change > 0
          ? "up"
          : change < 0
            ? "down"
            : "neutral");

    // Get trend icon
    const TrendIcon =
      calculatedTrend === "up"
        ? FaArrowUp
        : calculatedTrend === "down"
          ? FaArrowDown
          : FaMinus;

    // Format value with prefix/suffix
    const formattedValue =
      typeof value === "number"
        ? `${prefix}${value.toLocaleString(undefined, {
            minimumFractionDigits: precision,
            maximumFractionDigits: precision,
          })}${suffix}`
        : `${prefix}${value}${suffix}`;

    // Animation variants
    const animationVariants = {
      none: {},
      fade: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.5, delay: delay * 0.1 },
      },
      slide: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: delay * 0.1 },
      },
      scale: {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.5, delay: delay * 0.1 },
      },
    };

    // Loading skeleton
    if (loading) {
      return (
        <div
          ref={ref}
          className={cn(
            statsCardVariants({ variant, size }),
            "animate-pulse",
            className,
          )}
          {...props}
        >
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 w-24 bg-muted rounded"></div>
              <div className="h-8 w-32 bg-muted rounded"></div>
            </div>
            <div className="h-12 w-12 bg-muted rounded-lg"></div>
          </div>
          {description && (
            <div className="mt-4 h-3 w-full bg-muted rounded"></div>
          )}
        </div>
      );
    }

    const CardContent = (
      <div
        ref={ref}
        className={cn(
          statsCardVariants({ variant, size }),
          variant === "gradient" && gradientVariants[gradient],
          className,
        )}
        {...props}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                {formattedValue}
              </h3>
              {change !== undefined && (
                <div
                  className={cn(
                    "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
                    calculatedTrend === "up" &&
                      "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
                    calculatedTrend === "down" &&
                      "bg-rose-500/15 text-rose-700 dark:text-rose-300",
                    calculatedTrend === "neutral" &&
                      "bg-gray-500/15 text-gray-700 dark:text-gray-300",
                  )}
                >
                  <TrendIcon className="h-3 w-3" />
                  <span>{Math.abs(change)}%</span>
                </div>
              )}
            </div>

            {changeLabel && (
              <p className="text-xs text-muted-foreground">{changeLabel}</p>
            )}
          </div>

          {Icon && (
            <div className={cn(iconVariants({ variant }))}>
              <Icon className="h-6 w-6" />
            </div>
          )}
        </div>

        {description && (
          <p className="mt-4 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    );

    // Wrap with animation if needed
    if (animation !== "none") {
      return (
        <motion.div
          {...animationVariants[animation]}
          initial="initial"
          animate="animate"
        >
          {CardContent}
        </motion.div>
      );
    }

    return CardContent;
  },
);

StatsCard.displayName = "StatsCard";

export { StatsCard, statsCardVariants };
