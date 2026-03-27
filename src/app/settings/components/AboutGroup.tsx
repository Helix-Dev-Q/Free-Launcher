"use client";

import { LogOut } from "lucide-react";
import { useTheme } from "@/app/utils/hooks/theme";
import { Config } from "@/app/config/config";
import { useProfileStore } from "@/app/packages/zustand/profile";
import { useRouter } from "next/navigation";

export function AboutGroup() {
  const colors = useTheme();
  const { logout, displayName } = useProfileStore();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.replace("/auth");
  }

  return (
    <div className={`rounded-lg p-5 border ${colors.current.background2} ${colors.current.borderColor}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/icon.png" className="w-12 h-12 rounded-lg" />
          <div>
            <p className={`text-base font-semibold ${colors.current.foreground}`}>{Config.NAME}</p>
            <p className={`text-xs ${colors.current.foreground2}`}>v{Config.VERSION} · {displayName}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm transition-colors cursor-pointer"
        >
          <LogOut size={15} />
          Log out
        </button>
      </div>
    </div>
  );
}
