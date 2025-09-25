import { Settings } from "@/types/settings";

export function useSettings() {
  return useQuery<Settings, Error>({
    queryKey: [QueryKeys.SETTINGS],
    queryFn: getSettings,
  });
}
