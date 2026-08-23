import { useRouter } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function BackButton({ className }: { className?: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.history.back()}
      className={cn(
        "inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
        className,
      )}
    >
      <ChevronLeft className="h-4 w-4" /> Back
    </button>
  );
}
