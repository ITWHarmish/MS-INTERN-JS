import { useQuery } from "@tanstack/react-query";
import {
  GetInternReport,
  GetInternsByMentorId,
  GetMentorList,
} from "../services/adminAPI";
import { GetAllProgressReport } from "../services/progressReportAPI";

export const mentorsHook = (user) => {
  return useQuery({
    queryKey: ["mentors"],
    queryFn: GetMentorList,
    select: (res) => res.data,
    enabled: !!user?.admin || !!user?.id,
    staleTime: Infinity,
  });
};

export const internsHook = (user, selectedMentor) => {
  return useQuery({
    queryKey: ["students", user?._id, selectedMentor],
    queryFn: () =>
      user?.admin && selectedMentor
        ? GetInternsByMentorId(selectedMentor).then((res) => res.data)
        : user?._id
        ? GetInternsByMentorId(user._id).then((res) => res.data)
        : [],
    enabled: !!user?.admin || !!user?.id,
    staleTime: Infinity,
  });
};

export const internsReportHook = (selectedStudent, user) => {
  return useQuery({
    queryKey: ["studentReports", selectedStudent || user?._id],
    queryFn: () =>
      GetInternReport(selectedStudent || user?._id).then((res) => res.data),
    enabled: !!user?.admin || !!user?.id,
    staleTime: Infinity,
  });
};

export const progressReportHook = () => {
  return useQuery({
    queryKey: ["allchProgressReport"],
    queryFn: () => GetAllProgressReport(),

    staleTime: Infinity,
  });
};
