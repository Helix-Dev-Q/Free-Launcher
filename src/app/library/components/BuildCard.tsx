"use client";

import { Folder, Loader2, Lock, Play, Trash2, Pause } from "lucide-react";
import { openPath } from "@tauri-apps/plugin-opener";
import { useState } from "react";
import { SeasonInfo } from "@/app/utils/Season";
import { useTheme } from "@/app/utils/hooks/theme";
import { LIBRARY_KEY, useLibraryStore } from "@/app/packages/zustand/library";
import { Build } from "@/app/utils/types/library";
import { start } from "@/app/utils/build/launch";
import { exit } from "@/app/utils/build/close";

interface Item {
  path: string;
  build: any;
  options: string | null;
  setOptions: (path: string | null) => void;
  handleDeleteBuild: (path: string) => void;
  isPublicBuild: boolean;
  setImportedBuilds: any;
}

export function BuildCard({ path, build, options, setOptions, handleDeleteBuild, isPublicBuild, setImportedBuilds }: Item) {
  const majorVersion = build.version.split(".")[0];
  const imageUrl = SeasonInfo(majorVersion).image;
  const [hover, setHover] = useState(false);
  const colors = useTheme();
  const BuildState = useLibraryStore.getState();
  const currentBuild: Build | undefined = BuildState.entries.get(path);

  async function Launch() {
    if (!isPublicBuild) return;
    if (build.open) {
      const result = await exit(path);
      if (result) setImportedBuilds((prev: any) => prev.map(([p, b]: any) => p === path ? [p, { ...b, open: false }] : [p, b]));
    } else {
      const result = await start(path);
      if (result) setImportedBuilds((prev: any) => prev.map(([p, b]: any) => p === path ? [p, { ...b, open: true }] : [p, b]));
    }
  }

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`rounded-lg border overflow-hidden ${colors.current.background2} ${colors.current.borderColor}`}
    >
      <div className="relative w-full h-40 bg-black/20">
        <img src={imageUrl} alt={`Build ${build.version}`} className="w-full h-full object-cover" />
        {(hover || currentBuild?.open) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <button
              onClick={Launch}
              disabled={build.loading}
              className={`p-3 rounded-full transition-colors ${
                !isPublicBuild ? "bg-red-800 cursor-not-allowed" :
                build.loading ? "bg-zinc-700 cursor-not-allowed" :
                build.open ? "bg-red-600 hover:bg-red-700 cursor-pointer" :
                "bg-white hover:bg-zinc-200 cursor-pointer"
              }`}
            >
              {!isPublicBuild ? <Lock size={18} className="text-white" /> :
               build.loading ? <Loader2 size={18} className="animate-spin text-white" /> :
               build.open ? <Pause size={18} className="text-white" /> :
               <Play size={18} className="text-zinc-900" />}
            </button>
          </div>
        )}
      </div>

      <div className="p-3 flex items-center justify-between">
        <div>
          <p className={`text-sm font-semibold ${colors.current.foreground}`}>{build.season}</p>
          <p className={`text-xs font-mono ${colors.current.foreground2}`}>v{build.version}</p>
        </div>
        {(hover || options === path) && (
          <div className="flex gap-1">
            <button
              onClick={() => openPath(build.path)}
              className={`p-1.5 rounded cursor-pointer hover:opacity-80 ${colors.current.background}`}
              title="Open folder"
            >
              <Folder size={14} className={colors.current.foreground2} />
            </button>
            <button
              onClick={() => handleDeleteBuild(path)}
              className="p-1.5 rounded cursor-pointer hover:opacity-80 bg-red-950/40"
              title="Delete"
            >
              <Trash2 size={14} className="text-red-400" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
