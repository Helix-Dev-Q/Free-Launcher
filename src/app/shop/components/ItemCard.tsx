"use client";

import { useTheme } from "@/app/utils/hooks/theme";
import type { ShopItem } from "@/app/utils/types/shop";

export function ShopItemCard({ item }: { item: ShopItem }) {
  const { current: theme } = useTheme();

  return (
    <div className={`rounded-lg border overflow-hidden ${theme.background2} ${theme.borderColor}`}>
      <img
        src={item.images.featured || item.images.icon}
        alt={item.name}
        className="w-full h-[160px] object-contain bg-black/20"
        onError={(e) => { (e.target as HTMLImageElement).src = item.images.icon; }}
      />
      <div className="p-3">
        <p className={`text-xs font-semibold truncate ${theme.foreground}`}>{item.name}</p>
        <p className={`text-[10px] ${theme.foreground2}`}>{item.rarity.displayValue}</p>
        <div className="flex items-center gap-1 mt-1">
          <img src="https://image.fnbr.co/price/icon_vbucks_50x.png" alt="V-Bucks" className="w-3 h-3" />
          <span className={`text-xs font-bold ${theme.foreground}`}>{item.price.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
