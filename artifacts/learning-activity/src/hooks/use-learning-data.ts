import { useQuery } from "@tanstack/react-query";

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxix4uHCuqw5ugU4vfsNgiJKFWpxcQDgi_gZN2Erx05M-YnR_5b74rJgpox1T_880CH-w/exec";

export interface LearningData {
  users: string[][];
  program: string[][];
  responses: (string | number)[][];
}

export function useLearningData() {
  return useQuery<LearningData, Error>({
    queryKey: ["learning-data"],
    queryFn: async () => {
      const response = await fetch(APPS_SCRIPT_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch data from server");
      }
      return response.json();
    },
    // Cache the data for 10 minutes to prevent hitting the Apps Script quota
    staleTime: 10 * 60 * 1000, 
    gcTime: 15 * 60 * 1000,
    retry: 2,
  });
}
