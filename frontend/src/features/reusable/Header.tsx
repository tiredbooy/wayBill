import { useEffect } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, Moon, Sun, Laptop } from "lucide-react";
import { useState } from "react";
import {
  useSetting,
  useUpdateSetting,
} from "@/_libs/services/queries/setting.queries";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: settings, isLoading: isLoadingSettings } = useSetting();
  const updateSettingMutation = useUpdateSetting();

  useEffect(() => {
    if (settings?.preferred_theme && settings.preferred_theme !== theme) {
      setTheme(settings.preferred_theme);
    }
  }, [settings, theme, setTheme]);

  const handleThemeChange = async (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);

    try {
      await updateSettingMutation.mutateAsync({
        preferred_theme: newTheme,
      });
    } catch (error) {
      console.error("Failed to update theme in database", error);
      if (settings?.preferred_theme) {
        setTheme(settings.preferred_theme);
      }
    }
  };

  const toggleSidebar = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    window.dispatchEvent(new CustomEvent("toggle-sidebar"));
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Right side (RTL) */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">باز کردن منو</span>
          </Button>
          <span className="text-xl font-semibold">داشبورد</span>
        </div>

        {/* Left side – theme switcher */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                disabled={isLoadingSettings || updateSettingMutation.isPending}
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">تغییر تم</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                dir="rtl"
                onClick={() => handleThemeChange("light")}
              >
                <Sun className="ml-2 h-4 w-4" />
                <span>روشن</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                dir="rtl"
                onClick={() => handleThemeChange("dark")}
              >
                <Moon className="ml-2 h-4 w-4" />
                <span>تاریک</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                dir="rtl"
                onClick={() => handleThemeChange("system")}
              >
                <Laptop className="ml-2 h-4 w-4" />
                <span>سیستم</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
