import { toast } from "sonner";

interface ToastArgs { title?: string; description?: string; variant?: "default" | "destructive"; }

export function useToast() {
  return {
    toast: ({ title, description, variant }: ToastArgs) => {
      if (variant === "destructive") { toast.error(title, { description }); }
      else { toast.success(title, { description }); }
    },
  };
}
