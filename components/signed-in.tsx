"use client";

import { demoAccount } from "@/lib/data";
import { useStore } from "@/lib/store";

export function SignedIn() {
  const { t } = useStore();
  return (
    <div className="rounded-2xl bg-black/40 px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#f0c94a]">{t.signedIn}</p>
      <p className="font-semibold text-white">{demoAccount.name}</p>
      <p className="text-xs text-white/55">
        {demoAccount.phone} · {demoAccount.email}
      </p>
    </div>
  );
}
