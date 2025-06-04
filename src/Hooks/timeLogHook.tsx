import { useQuery } from "@tanstack/react-query";
import { GetTimelogs } from "../services/timelogAPI";

export const timeLogHook = (user, formattedDate, userId) => {
  return useQuery({
    queryKey: ["timelogs", formattedDate, userId],
    queryFn: () => GetTimelogs(formattedDate, userId),
    enabled: !!user?.admin || !!user?._id,
    staleTime: Infinity,
  });
};
