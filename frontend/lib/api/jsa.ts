import { apiClient } from "../api-client";
import { JSAForm, JSA } from "../../types/jsa";

export const getJSAList = async (): Promise<JSA[]> => {
  const { data } = await apiClient.get<{ data: JSA[] }>("/jsa");
  return data.data;
};

export const getJSAById = async (id: number): Promise<JSA> => {
  const { data } = await apiClient.get<{ data: JSA }>(`/jsa/${id}`);
  return data.data;
};

export const createJSA = async (jsaData: JSAForm): Promise<JSA> => {
  const { data } = await apiClient.post<{ data: JSA }>("/jsa", jsaData);
  return data.data;
};

export const approveJSAByK3 = async (id: number): Promise<void> => {
  await apiClient.post(`/jsa/${id}/approve/k3`);
};

export const downloadJSAPDF = async (id: number, jobNumber: string): Promise<void> => {
  const response = await apiClient.get(`/jsa/${id}/pdf`, { responseType: "blob" });
  
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `JSA-${jobNumber}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};
