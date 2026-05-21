export const API_URL = (import.meta as any).env.VITE_API_URL;

export const fetchJobs = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${API_URL}/jobs?${query}`);
  return response.json();
};

export const fetchResults = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${API_URL}/results?${query}`);
  return response.json();
};

export const fetchScholarships = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${API_URL}/scholarships?${query}`);
  return response.json();
};

export const fetchSchemes = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${API_URL}/schemes?${query}`);
  return response.json();
};

export const fetchCategories = async (type?: string) => {
  const url = type ? `${API_URL}/categories?type=${type}` : `${API_URL}/categories`;
  const response = await fetch(url);
  return response.json();
};

export const fetchNews = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${API_URL}/news?${query}`);
  return response.json();
};

export const fetchNewsById = async (id: string) => {
  const response = await fetch(`${API_URL}/news/${id}`);
  return response.json();
};

export const submitContact = async (data: any) => {
  const response = await fetch(`${API_URL}/contacts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const fetchStudyMaterials = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${API_URL}/study-materials?${query}`);
  return response.json();
};
