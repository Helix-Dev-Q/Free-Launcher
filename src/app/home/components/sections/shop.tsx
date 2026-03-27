"use client";
import { useState, useEffect } from "react";
import { Config } from "@/app/config/config";
import { ShopItem } from "@/app/utils/types/shop";
import axios from "axios";
import { useTheme } from "@/app/utils/hooks/theme";

export function SmallShop() {
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

      setItems(loaded.slice(0, 1));
    } catch {}
    setLoading(false);
  };

  if (loading) return (
    <div className={`w-[220px] h-[220px] rounded-lg flex items-center justify-center ${colors.current.background2}`}>
      <span className={`text-xs ${colors.current.foreground2}`}>Loading...</span>
    </div>
  );

  if (!items.length) return (
    <div className={`w-[220px] h-[220px] rounded-lg flex items-center justify-center ${colors.current.background2}`}>
      <span className={`text-xs ${colors.current.foreground2}`}>No items</span>
    </div>
  );

  const item = items[0];
  return (
    <div className={`w-[220px] rounded-lg overflow-hidden border ${colors.current.borderColor} ${colors.current.background2}`}>
      <img
        src={item.images.featured || item.images.icon}
        alt={item.name}
        className="w-full h-[150px] object-contain bg-black/20"
        onError={(e) => { (e.target as HTMLImageElement).src = item.images.icon; }}
      />
      <div className="p-3">
        <p className={`text-sm font-semibold truncate ${colors.current.foreground}`}>{item.name}</p>
        <p className={`text-xs ${colors.current.foreground2}`}>{item.rarity.displayValue}</p>
        <div className="flex items-center gap-1 mt-1">
          <img src="https://image.fnbr.co/price/icon_vbucks_50x.png" alt="V-Bucks" className="w-3 h-3" />
          <span className={`text-xs font-bold ${colors.current.foreground}`}>{item.price.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
