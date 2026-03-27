import { Config } from "@/app/config/config";
import { SeasonInfo } from "@/app/utils/Season";
import { useTheme } from "@/app/utils/hooks/theme";

export function BuildSection() {
  const { readableSeason, description } = SeasonInfo(Config.CURRENT_SEASON);
  const colors = useTheme();

  return (
    <div className={`rounded-lg border p-4 mb-4 ${colors.current.background2} ${colors.current.borderColor}`}>
      <p className={`text-xs mb-1 ${colors.current.foreground2}`}>{Config.NAME}</p>
      <p className={`text-base font-semibold ${colors.current.foreground}`}>{readableSeason}</p>
      <p className={`text-xs mt-1 ${colors.current.foreground2}`}>{description}</p>
    </div>
  );
}
