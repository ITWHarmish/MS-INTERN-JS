import { useQuery } from "@tanstack/react-query";
import { SendTimelogToSheet } from "../services/timelogAPI";

export const todocardHook = (messageText) => {
  return useQuery({
    queryKey: ["SendTimelogToSpreadSheets"],
    queryFn: () => SendTimelogToSheet(messageText),
    staleTime: Infinity,
  });
};
