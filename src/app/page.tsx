"use client";

import { JSX, useEffect, useState } from "react";
import { Sidebar } from "./components/sidebar";
import { useTheme } from "./utils/hooks/theme";
import type { View } from "./utils/types/views";
import Home from "./home/page";
import Library from "./library/page";
import Shop from "./shop/page";
import Settings from "./settings/page";
import { useConfigStore } from "./packages/zustand/configs";
import { Config } from "./config/config";
import { useProfileStore } from "./packages/zustand/profile";
import { useRouter } from "next/navigation";

export default function App() {
  const colors = useTheme();
  const [view, setView] = useState<View>("home");
  const { setTheme } = useConfigStore();
  const router = useRouter();

  const { accountId, displayName, hydrated } = useProfileStore();

  useEffect(() => {
    if (hydrated && !(accountId && displayName)) {
      router.replace("/auth");
    }
  }, [hydrated, accountId, displayName]);

  useEffect(() => {
    setTheme(Config.THEME);
  }, [setTheme]);

  const views: Record<View, JSX.Element> = {
    home: <Home />,
    library: <Library />,
    shop: <Shop />,
    settings: <Settings />,
  };

  return (
    <div className={`h-full w-full flex ${colors.current.background}`}>
      <Sidebar view={view} setView={setView} />
      <main className="flex-1 mt-12 overflow-auto">
        {views[view]}
      </main>
    </div>
  );
}
