export const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000/api';

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
