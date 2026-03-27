"use client";

import { BuildSection } from "./components/sections/build";
import { NewsSection } from "./components/sections/news";
import { SmallShop } from "./components/sections/shop";

export default function Home() {
  return (
    <main className="p-6 flex flex-col gap-4">
      <BuildSection />
      <div className="flex flex-row gap-4">
        <SmallShop />
        <div className="flex-1">
          <NewsSection />
        </div>
      </div>
    </main>
  );
}
