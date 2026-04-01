import { apiClient } from "../api-client";
import { WorkPermitForm, WorkPermit } from "../../types/work-permit";

export const getWorkPermits = async (): Promise<WorkPermit[]> => {
  const { data } = await apiClient.get<{ data: WorkPermit[] }>("/work-permits");
  return data.data;
};

export const getWorkPermitById = async (id: number): Promise<WorkPermit> => {
  const { data } = await apiClient.get<{ data: WorkPermit }>(`/work-permits/${id}`);
  return data.data;
};

export const createWorkPermit = async (permit: WorkPermitForm): Promise<WorkPermit> => {
  const { data } = await apiClient.post<{ data: WorkPermit }>("/work-permits", permit);
  return data.data;
};

export const approveByManager = async (id: number): Promise<void> => {
  await apiClient.post(`/work-permits/${id}/approve/manager`);
};

export const approveByK3 = async (id: number): Promise<void> => {
  await apiClient.post(`/work-permits/${id}/approve/k3`);
};

export const downloadPDF = async (id: number, permitNumber: string): Promise<void> => {
  const response = await apiClient.get(`/work-permits/${id}/pdf`, { responseType: "blob" });
  
  // Create download link
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `IjinKerja-${permitNumber}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};
