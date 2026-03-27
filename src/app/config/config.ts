type Config = {
  NAME: string;
  VERSION: string;
  BACKEND_URL: string;
  BACKEND_PORT: string;
  CURRENT_SEASON: string;
  CURRENT_VERSION: string;
  ALLOW_ALL_VERSIONS: string;
  REDIRECT_DOWNLOAD: string;
  THEME: string;
};

type Library = {
  KEY: string;
};

export const Config: Config = {
  NAME: process.env.NEXT_PUBLIC_LAUNCHER_NAME || "Unknown",
  VERSION: process.env.NEXT_PUBLIC_LAUNCHER_VERSION || "1.0.0",
  BACKEND_URL:
    process.env.NEXT_PUBLIC_LAUNCHER_BACKEND_URL || "http://209.25.140.26",
  BACKEND_PORT: process.env.NEXT_PUBLIC_LAUNCHER_BACKEND_PORT || "25602",
  CURRENT_SEASON: process.env.NEXT_PUBLIC_LAUNCHER_SEASON || "26",
  CURRENT_VERSION: process.env.NEXT_PUBLIC_LAUNCHER_VERSION || "26.30",
  ALLOW_ALL_VERSIONS:
    process.env.NEXT_PUBLIC_LAUNCHER_ALLOW_ALL_VERSIONS?.toLowerCase() ||
    "false",
  REDIRECT_DOWNLOAD: process.env.NEXT_PUBLIC_LAUNCHER_REDIRECT_DOWNLOAD || "",
  THEME: process.env.NEXT_PUBLIC_LAUNCHER_THEME?.toLowerCase() || "default",
};

export const LibraryConfig: Library = {
  KEY: "storage:library",
};
