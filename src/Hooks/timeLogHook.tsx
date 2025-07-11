import { useQuery } from "@tanstack/react-query";
import { GetTimelogs, SendTimelogToSheet } from "../services/timelogAPI";
import { GetCurrentUser } from "../services/authAPI";
import { GetTodo } from "../services/todoAPI";
import {
  GetTelegram,
  TelegramSessionValidation,
} from "../services/telegramAPI";

export const timeLogHook = (user, formattedDate, internId) => {
  return useQuery({
    queryKey: ["timelog", formattedDate, user?.admin ? internId : user?._id],
    queryFn: () =>
      GetTimelogs(formattedDate, user?.admin ? internId : user?._id),
    enabled: !!user?._id || user?.admin,
    staleTime: Infinity,
  });
};

export const todocardHook = (messageText) => {
  return useQuery({
    queryKey: ["SendTimelogToSpreadSheets"],
    queryFn: () => SendTimelogToSheet(messageText),
    staleTime: Infinity,
  });
};

export const layoutHook = (token) => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: () => GetCurrentUser(),
    enabled: !!token,
    staleTime: Infinity,
  });
};

export const tasktableHook = (user, formattedDate, userId) => {
  return useQuery({
    queryKey: ["timeLog", formattedDate, userId],
    queryFn: () => GetTimelogs(formattedDate, userId),
    enabled: !!user?._id || user?.admin,
    staleTime: Infinity,
  });
};

export const todohook = (user, internId) => {
  const userId = user?.admin ? internId : user?._id;
  return useQuery({
    queryKey: ["todo"],
    queryFn: () => {
      // if (userId) {
      return GetTodo(userId);
      // }
    },
    enabled: !!user?._id || user?.admin,
    staleTime: Infinity,
  });
};

export const telegramHook = (user) => {
  return useQuery({
    queryKey: ["telegram"],
    queryFn: () => {
      // if (!user.admin) {
      return GetTelegram();
      // }
    },
    enabled: !!user?._id || user?.admin,
    staleTime: Infinity,
  });
};

export const TelegramValidationHook = (user) => {
  return useQuery({
    queryKey: ["TelegramValidation"],
    queryFn: () => TelegramSessionValidation(),
    enabled: !!user?._id,
    staleTime: Infinity,
  });
};
