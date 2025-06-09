import { useQuery } from "@tanstack/react-query";
import { GetLeaveRequests } from "../services/leaveAPI";
import { GetMonthlySummary } from "../services/monthlySummaryAPI";
import dayjs from "dayjs";

export const leaveRequestsHook = (user: any, internId: string) => {
  return useQuery({
    queryKey: ["leaveRequests", user?._id, internId],
    queryFn: () => {
      const userId = user?.admin ? internId : user?._id;

      if (!userId) {
        throw new Error("No valid user ID available for leave requests");
      }

      return GetLeaveRequests({ userId });
    },

    enabled: !!user?._id || !!user?.admin,
    staleTime: Infinity,
  });
};

export const monthlySummaryHook = (user, internId, currentDate) => {
  return useQuery({
    queryKey: ["monthlySummary", user?._id, internId, currentDate],
    queryFn: () => {
      const userId = user?.admin ? internId : user?._id;

      if (!userId) {
        throw new Error("No user ID available for monthly summary");
      }

      const selectedMonth = dayjs(currentDate).month() + 1;
      const selectedYear = dayjs(currentDate).year();

      const payload = {
        year: selectedYear,
        month: selectedMonth,
        userId: userId,
      };

      return GetMonthlySummary(payload);
    },

    enabled: !!user?._id || !!user?.admin,
    staleTime: Infinity,
  });
};
