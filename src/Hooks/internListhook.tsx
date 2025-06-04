import { useQuery } from "@tanstack/react-query";
import { GetInternsByMentorId } from "../services/adminAPI";

export const getInternHook = (user) => {
  return useQuery({
    queryKey: ["interns", user._id],
    queryFn: () => GetInternsByMentorId(user._id).then((res) => res.data),
    enabled: !!user?.admin,
    staleTime: Infinity,
  });
};
