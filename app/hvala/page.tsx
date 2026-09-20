import { Suspense } from "react";
import { ThanksPage } from "@/components/views";

export default function Page() {
  return (
    <Suspense>
      <ThanksPage />
    </Suspense>
  );
}
