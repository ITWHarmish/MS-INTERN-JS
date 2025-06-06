import { useQuery } from "@tanstack/react-query";
import { GetTimelogs, SendTimelogToSheet } from "../services/timelogAPI";
import { GetCurrentUser } from "../services/authAPI";
import { GetTodo } from "../services/todoAPI";
import {
  GetTelegram,
  TelegramSessionValidation,
} from "../services/telegramAPI";

export const timeLogHook = (user, formattedDate) => {
  return useQuery({
    queryKey: ["timeLog", formattedDate, user?._id],
    queryFn: () => GetTimelogs(formattedDate, user?._id),
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
    retry: false,
    staleTime: Infinity,
  });
};

export const tasktableHook = (user, internId, formattedDate, userId) => {
  return useQuery({
    queryKey: ["timeLog", formattedDate, userId],
    queryFn: () => GetTimelogs(formattedDate, userId),
    enabled: !!user?._id && (user?.admin ? !!internId : true),
    staleTime: Infinity,
  });
};

export const todohook = (user) => {
  return useQuery({
    queryKey: ["todo"],
    queryFn: () => GetTodo(user),
    enabled: !!user?._id || user?.admin,
    staleTime: Infinity,
  });
};

export const telegramHook = (user) => {
  return useQuery({
    queryKey: ["telegram", user?._id],
    queryFn: () => GetTelegram(),
    enabled: !!user?._id && (user?.admin ? false : true),
    staleTime: Infinity,
  });
};

export const TelegramValidationHook = (user, internId) => {
  return useQuery({
    queryKey: ["TelegramValidation"],
    queryFn: () => TelegramSessionValidation(),
    enabled: !!user?._id && (user?.admin ? !!internId : true),
    staleTime: Infinity,
  });
};
