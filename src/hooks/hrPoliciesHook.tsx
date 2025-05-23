import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DeletePolicy,
  GetPolicies,
  UpdatePoliciesOrder,
} from "../services/hrPolicyAPI";
import { message } from "antd";

export const policiesHook = () => {
  return useQuery({
    queryKey: ["policies"],
    queryFn: GetPolicies,
    staleTime: Infinity,
  });
};

export const deletePilicyHook = () => {
  const QuseryClient = useQueryClient();
  return useMutation({
    mutationFn: DeletePolicy,
    onSuccess: () => {
      message.success("Policy Deleted Successfully");
      QuseryClient.invalidateQueries({ queryKey: ["policies"] });
    },
  });
};

export const updatePoliciesOrderHook = () => {
  const QuseryClient = useQueryClient();
  return useMutation({
    mutationFn: UpdatePoliciesOrder,
    onSuccess: () => {
      message.success("polices oder Update successfully");
      QuseryClient.invalidateQueries({ queryKey: ["policies"] });
    },
  });
};

export const editHook = (setIsEditMode, setSelectedPolicy, setIsModalOpen) => {
  return useMutation({
    mutationFn: async (policy) => {
      setIsEditMode(true);
      setSelectedPolicy(policy);
      setIsModalOpen(true);
    },
    onSuccess: () => {
      message.success("Policy Updated Successfully");
    },
  });
};
