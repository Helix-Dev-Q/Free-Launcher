"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/app/utils/hooks/theme";
import type { ShopItem } from "@/app/utils/types/shop";
import { Config } from "@/app/config/config";
import axios from "axios";
import { ShopItemCard } from "@/app/shop/components/ItemCard";

export default function Shop() {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const colors = useTheme();

  useEffect(() => {
    fetchShop();
  }, []);

  const fetchShop = async () => {
    try {
      const res = await axios.get(
        `${Config.BACKEND_URL}:${Config.BACKEND_PORT}/fortnite/api/storefront/v2/catalog`
      );
      const json = res.data;
      const daily = json.storefronts.find((s: any) => s.name === "BRDailyStorefront")?.catalogEntries || [];
      const weekly = json.storefronts.find((s: any) => s.name === "BRWeeklyStorefront")?.catalogEntries || [];
      const loaded: ShopItem[] = [];

      for (const entry of [...weekly, ...daily]) {
        const price = entry.prices?.[0]?.finalPrice ?? 0;
        const id = entry.devName?.split(":")[1];
        if (!id) continue;
        try {
          const data = await (await fetch(`https://fortnite-api.com/v2/cosmetics/br/${id}`)).json();
          if (data.status !== 200 || !data.data) continue;
          loaded.push({
            id: data.data.id,
            name: data.data.name,
            description: data.data.description,
            price,
            images: { featured: data.data.images.featured, icon: data.data.images.icon },
            rarity: data.data.rarity,
          });
        } catch { continue; }
      }

      setItems(loaded);
    } catch {}
    setLoading(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <span className={`text-sm ${colors.current.foreground2}`}>Loading shop...</span>
    </div>
  );

  return (
    <main className="p-6">
      <h1 className={`text-2xl font-bold mb-1 ${colors.current.foreground}`}>Item Shop</h1>
      <p className={`text-xs mb-6 ${colors.current.foreground2}`}>{items.length} items available</p>
      {items.length === 0 ? (
        <p className={`text-sm ${colors.current.foreground2}`}>No items found.</p>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {items.map((item) => (
            <ShopItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </main>
  );
}
