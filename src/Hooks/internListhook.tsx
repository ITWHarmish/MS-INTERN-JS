import { useQuery } from "@tanstack/react-query";
import { GetInternsByMentorId, GetSpaceId } from "../services/adminAPI";

export const getInternsHook = (user) => {
  return useQuery({
    queryKey: ["interns", user?._id],
    queryFn: () => GetInternsByMentorId(user?._id).then((res) => res.data),
    enabled: !!user?.admin,
    staleTime: Infinity,
  });
};

export const spaceListHook = (user) => {
  return useQuery({
    queryKey: ["space"],
    queryFn: async () => {
      const res = await GetSpaceId();
      return res.data?.filter((item) => item.name);
    },
    enabled: !!user?.admin,
    staleTime: Infinity,
  });
};
