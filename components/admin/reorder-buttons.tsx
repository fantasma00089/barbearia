"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api-client";

export function ReorderButtons({ url, first, last }: { url: string; first: boolean; last: boolean }) {
  const router = useRouter();
  const [, start] = useTransition();
  const [busy, setBusy] = useState(false);
  const move = async (direction: "up" | "down") => {
    setBusy(true);
    try {
      await apiFetch(url, { method: "POST", json: { direction } });
      start(() => router.refresh());
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="flex flex-col">
      <Button type="button" variant="ghost" size="icon" className="size-7" disabled={first || busy} onClick={() => move("up")} aria-label="Mover para cima">
        <ArrowUp />
      </Button>
      <Button type="button" variant="ghost" size="icon" className="size-7" disabled={last || busy} onClick={() => move("down")} aria-label="Mover para baixo">
        <ArrowDown />
      </Button>
    </div>
  );
}
