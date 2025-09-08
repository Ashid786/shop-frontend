// Use the environment variable from Netlify or your .env file
export const API = import.meta.env.VITE_BACKEND_URL;

// Wrapper function for API calls
export const http = (path, init) => fetch(API + path, init);
