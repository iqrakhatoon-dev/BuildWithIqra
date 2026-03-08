import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Coffee, Repeat } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SupportModalProps {
  open: boolean;
  onClose: () => void;
}

export function SupportModal({ open, onClose }: SupportModalProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (mode: "tip" | "subscription") => {
    setLoading(mode);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { mode },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (err: any) {
      toast.error(err.message || "Checkout failed");
    } finally {
      setLoading(null);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-card rounded-lg border-glow p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="fluid-text-lg font-bold text-foreground flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary fill-primary" />
                Support My Journey
              </h2>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="fluid-text-sm text-muted-foreground mb-6">
              Your support helps me keep learning, building, and sharing my coding journey with the community! 💖
            </p>

            <div className="space-y-3">
              <button
                onClick={() => handleCheckout("tip")}
                disabled={loading !== null}
                className="w-full bg-gradient-rosy text-primary-foreground rounded-lg py-3 fluid-text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Coffee className="h-4 w-4" />
                {loading === "tip" ? "Loading..." : "Buy Me a Coffee — $5"}
              </button>

              <button
                onClick={() => handleCheckout("subscription")}
                disabled={loading !== null}
                className="w-full bg-secondary text-secondary-foreground rounded-lg py-3 fluid-text-sm font-semibold hover:bg-muted transition-colors border-glow disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Repeat className="h-4 w-4" />
                {loading === "subscription" ? "Loading..." : "Subscribe Monthly — $10/mo"}
              </button>
            </div>

            <p className="fluid-text-xs text-muted-foreground text-center mt-4">
              Powered by Stripe • Secure payment
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
