import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type ModalSize = "sm" | "md" | "lg" | "xl" | "full";
type ScrollMode = "content" | "body";

type ModalShellProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title?: React.ReactNode;
  description?: React.ReactNode;

  children: React.ReactNode;
  footer?: React.ReactNode;

  size?: ModalSize;
  scroll?: ScrollMode;

  loading?: boolean;
  closeOnOverlayClick?: boolean;

  className?: string;
  bodyClassName?: string;
  maxHeightClassName?: string;
};

const SIZE_CLASS: Record<ModalSize, string> = {
  sm: "sm:max-w-[420px]",
  md: "sm:max-w-[560px]",
  lg: "sm:max-w-[720px]",
  xl: "sm:max-w-[920px]",
  full: "sm:max-w-[96vw]",
};

export default function ModalShell({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = "md",
  scroll = "content",
  loading = false,
  closeOnOverlayClick = true,
  className,
  bodyClassName,
  maxHeightClassName = "max-h-[85vh]",
}: ModalShellProps) {
  const handleOpenChange = (next: boolean) => {
    if (!next && loading) return;
    onOpenChange(next);
  };

  const blockOutsideClose = loading || !closeOnOverlayClick;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        dir="rtl"
        className={cn(SIZE_CLASS[size], "p-0 overflow-hidden", className)}
        onPointerDownOutside={(e) => {
          if (blockOutsideClose) e.preventDefault();
        }}
        onInteractOutside={(e) => {
          if (blockOutsideClose) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (loading) e.preventDefault();
        }}
      >
        <div
          className={cn(
            "flex min-h-0 flex-col",
            maxHeightClassName,
            scroll === "body" && "overflow-y-auto",
          )}
        >
          {(title || description) && (
            <DialogHeader
              dir="rtl"
              className="shrink-0 px-6 py-6 text-start sm:!text-start"
            >
              {title && (
                <DialogTitle className="text-start sm:!text-start">
                  {title}
                </DialogTitle>
              )}
              {description && (
                <DialogDescription className="text-start sm:!text-start">
                  {description}
                </DialogDescription>
              )}
            </DialogHeader>
          )}

          {scroll === "content" ? (
            <ScrollArea dir="rtl" className="min-h-0 flex-1 w-full">
              <div
                className={cn(
                  "px-6",
                  !title && !description ? "pt-6" : "pt-4",
                  footer ? "pb-4" : "pb-6",
                  bodyClassName,
                )}
              >
                {children}
              </div>
            </ScrollArea>
          ) : (
            <div
              className={cn(
                "px-6",
                !title && !description ? "pt-6" : "pt-4",
                footer ? "pb-4" : "pb-6",
                bodyClassName,
              )}
            >
              {children}
            </div>
          )}

          {footer && (
            <DialogFooter className="shrink-0 px-6 pb-6">{footer}</DialogFooter>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
