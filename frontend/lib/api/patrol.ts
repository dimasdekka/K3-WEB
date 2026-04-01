import { apiClient } from "../api-client";
import { PatrolForm, PatrolK3 } from "../../types/patrol";

export const getPatrolsList = async (): Promise<PatrolK3[]> => {
  const { data } = await apiClient.get<{ data: PatrolK3[] }>("/patrol");
  return data.data;
};

export const getPatrolById = async (id: number): Promise<PatrolK3> => {
  const { data } = await apiClient.get<{ data: PatrolK3 }>(`/patrol/${id}`);
  return data.data;
};

export const createPatrol = async (payload: PatrolForm): Promise<PatrolK3> => {
  const { data } = await apiClient.post<{ data: PatrolK3 }>("/patrol", payload);
  return data.data;
};

export const approvePatrolByPIC = async (id: number): Promise<void> => {
  await apiClient.post(`/patrol/${id}/approve/pic`);
};

export const downloadPatrolPDF = async (id: number, numberStr: string): Promise<void> => {
  const response = await apiClient.get(`/patrol/${id}/pdf`, { responseType: "blob" });
  
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `PATROL-${numberStr}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};
