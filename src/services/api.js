export const API = import.meta.env.VITE_API_URL || "http://localhost:8080"; 

export const http = (path, init) => fetch(API + path, init);